import * as ExpoCrypto from 'expo-crypto';
import * as Keychain from 'react-native-keychain';
import 'react-native-get-random-values';
import { getBackupFromRemote } from './PocketBaseBackupService';

const ENCRYPTION_KEY_STORAGE_KEY = 'dk.ratemyday.userEncryptionKey';

export const getOrCreateSalt = async () => {
  try {
    const randomBytes = await ExpoCrypto.getRandomBytesAsync(16);
    // Convert to base64 instead of using Buffer
    return Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Error getting/creating salt:', error);
    throw error;
  }
};

export const deriveEncryptionKey = async (userId: string) => {
  try {
    const salt = await getOrCreateSalt();    
    const key = await ExpoCrypto.digestStringAsync(
      ExpoCrypto.CryptoDigestAlgorithm.SHA256,
      salt + userId,
      {
        encoding: ExpoCrypto.CryptoEncoding.HEX,
      }
    );
    return key;
  } catch (error) {
    console.error('Error deriving encryption key:', error);
    throw error;
  }
};

export const encryptData = async (plainText: string, encryptionKeyHex: string): Promise<string> => {
  try {
    // Generate a random IV
    const iv = await ExpoCrypto.getRandomBytesAsync(16);
    const ivHex = Array.from(iv)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Encrypt the data using the concatenated values
    const encrypted = await ExpoCrypto.digestStringAsync(
      ExpoCrypto.CryptoDigestAlgorithm.SHA256,
      ivHex + encryptionKeyHex + btoa(plainText),
      {
        encoding: ExpoCrypto.CryptoEncoding.HEX,
      }
    );
    
    // Return IV and encrypted data concatenated
    return `${ivHex}:${encrypted}`;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
};

export const decryptData = async (cipherText: string, encryptionKeyHex: string): Promise<string> => {
  try {
    const [ivHex, encrypted] = cipherText.split(':');
    if (!ivHex || !encrypted) {
      throw new Error('Invalid ciphertext format');
    }
    
    // Decrypt using the same method as encryption
    const decrypted = await ExpoCrypto.digestStringAsync(
      ExpoCrypto.CryptoDigestAlgorithm.SHA256,
      ivHex + encryptionKeyHex,
      {
        encoding: ExpoCrypto.CryptoEncoding.HEX,
      }
    );
    
    try {
      return atob(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
};

export const getOrCreateEncryptionKey = async (): Promise<string | null> => {
  try {
    /*
    const stored = await Keychain.getGenericPassword({ service: ENCRYPTION_KEY_STORAGE_KEY });
    
    if (stored) {
      return stored.password;
    }
    
    
    // Generate a new random key
    const randomBytes = await ExpoCrypto.getRandomBytesAsync(32);
    const newKey = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    await Keychain.setGenericPassword(ENCRYPTION_KEY_STORAGE_KEY, newKey, { 
      service: ENCRYPTION_KEY_STORAGE_KEY 
    });
    */
    const key = getBackupFromRemote();
    return key;
  } catch (error) {
    console.error('Error getting encryption key:', error);
    throw error;
  }
};
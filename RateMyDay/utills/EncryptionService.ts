import * as ExpoCrypto from 'expo-crypto';
import * as Keychain from 'react-native-keychain';
import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';
import { getBackupFromRemote } from './PocketBaseBackupService';
import { pb } from './pbClient';


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
    
    // Use AES encryption
    const encrypted = CryptoJS.AES.encrypt(plainText, encryptionKeyHex, {
      iv: CryptoJS.enc.Hex.parse(ivHex),
    }).toString();
    
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
    
    // Decrypt using AES
    const bytes = CryptoJS.AES.decrypt(encrypted, encryptionKeyHex, {
      iv: CryptoJS.enc.Hex.parse(ivHex),
    });
    
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
};

export const getOrCreateEncryptionKey = async (userId: string): Promise<string | null> => {
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
    
    const key = await getBackupFromRemote(userId);
    console.log('key: ', key);
    return key;
  } catch (error) {
    console.error('Error getting encryption key:', error);
    throw error;
  }
};
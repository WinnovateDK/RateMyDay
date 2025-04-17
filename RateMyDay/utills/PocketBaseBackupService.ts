// PocketBaseBackupService.ts
import PocketBase from 'pocketbase';
import Config from 'react-native-config';

// Initialize PocketBase client with your backend URL.
const pb = new PocketBase("https://winnovate.pockethost.io");

/**
 * getCurrentUserId
 *  - Retrieves the ID of the currently authenticated user from PocketBase's authStore.
 *  - Throws an error if no user is authenticated.
 */
const getCurrentUserId = (): string => {
  if (!pb.authStore.record || !pb.authStore.record.id) {
    throw new Error('User is not authenticated.');
  }
  return pb.authStore.record.id;
};

/**
 * saveBackupToRemote
 *  - Saves the backup record (wrapped DEK) remotely in the "key_backups" collection.
 *  - The record is automatically associated with the authenticated user's ID.
 *  - Ensure that your PocketBase collection "key_backups" is configured so that
 *    only the owner (matched by the userId field) can create, read, or update the record.
 *
 * @param backupRecord - The backup string in the format "backupSalt:iv:wrappedDEK".
 */
export const saveBackupToRemote = async (backupRecord: string, userid: string | undefined = undefined): Promise<any> => {
  if (!userid){
    userid = getCurrentUserId();
  }
  const data = {
    userId: userid,
    backupRecord: backupRecord,
  };
  return await pb.collection('key_backups').create(data);
};

/**
 * getBackupFromRemote
 *  - Retrieves the backup record from the "key_backups" collection for the current user.
 *  - Returns the backup string if found, otherwise null.
 */
export const getBackupFromRemote = async (userId: string): Promise<string | null> => {
  const records = await pb.collection('key_backups').getFullList({ filter: `userId="${userId}"` });
  console.log('Records:', records);
  if (records && records.length > 0) {
    return records[0].backupRecord;
  }
  return null;
};

/**
 * updateRemoteBackup
 *  - Updates the backup record for the current authenticated user.
 *  - If a backup record already exists, it is updated; otherwise, a new record is created.
 *
 * @param backupRecord - The new backup string.
 */
export const updateRemoteBackup = async (backupRecord: string): Promise<any> => {
  const userId = getCurrentUserId();
  const records = await pb.collection('key_backups').getFullList({
    filter: `userId = "${userId}"`,
  });
  if (records && records.length > 0) {
    // Update the first (and ideally only) backup record for this user.
    const recordId = records[0].id;
    return await pb.collection('key_backups').update(recordId, { backup: backupRecord });
  } else {
    // If no backup exists, create a new record.
    return await saveBackupToRemote(backupRecord);
  }
};
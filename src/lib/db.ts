import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const db = {
  get: <T>(key: string): T | null => {
    try {
      const value = storage.getString(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading ${key} from MMKV:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to MMKV:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error(`Error deleting ${key} from MMKV:`, error);
    }
  },

  clear: (): void => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('Error clearing MMKV storage:', error);
    }
  },

  getAllKeys: (): string[] => {
    try {
      return storage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from MMKV:', error);
      return [];
    }
  },

  contains: (key: string): boolean => {
    try {
      return storage.contains(key);
    } catch (error) {
      console.error(`Error checking if ${key} exists in MMKV:`, error);
      return false;
    }
  }
};

export default db;
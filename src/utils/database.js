/**
 * IndexedDB Manager
 * Database lokal untuk data yang lebih besar (foto, file, dll)
 */

const DB_NAME = 'LoveStoryDB';
const DB_VERSION = 1;

export class Database {
  constructor() {
    this.db = null;
  }

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('❌ Database error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ Database initialized');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Buat object stores (seperti tabel)
        if (!db.objectStoreNames.contains('memories')) {
          db.createObjectStore('memories', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'id' });
        }
        
        console.log('✅ Database schema created');
      };
    });
  }

  // Save data to IndexedDB
  async save(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => {
        console.log(`✅ Saved to ${storeName}:`, data);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`❌ Error saving to ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Get data from IndexedDB
  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        console.log(`✅ Retrieved from ${storeName}:`, request.result);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`❌ Error retrieving from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Get all data
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        console.log(`✅ Retrieved all from ${storeName}:`, request.result);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`❌ Error retrieving from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Delete data
  async delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        console.log(`✅ Deleted from ${storeName}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ Error deleting from ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Clear store
  async clear(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log(`✅ Cleared ${storeName}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ Error clearing ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  // Get database size
  async getSize() {
    return new Promise((resolve) => {
      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(estimate => {
          const used = (estimate.usage / 1024 / 1024).toFixed(2); // MB
          const quota = (estimate.quota / 1024 / 1024).toFixed(2); // MB
          console.log(`💾 Storage: ${used}MB / ${quota}MB`);
          resolve({ used, quota });
        });
      } else {
        resolve(null);
      }
    });
  }
}

export const db = new Database();
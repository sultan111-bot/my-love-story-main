/**
 * Local Storage Manager
 * Menyimpan data di HP secara lokal (super cepat, tidak perlu internet)
 */

class StorageManager {
    constructor(prefix = 'love-story-') {
      this.prefix = prefix;
    }
  
    // Save data
    setItem(key, value) {
      try {
        const prefixedKey = `${this.prefix}${key}`;
        const serialized = JSON.stringify(value);
        localStorage.setItem(prefixedKey, serialized);
        console.log(`✅ Saved: ${key}`, value);
        return true;
      } catch (error) {
        console.error('❌ Storage error:', error);
        return false;
      }
    }
  
    // Get data
    getItem(key) {
      try {
        const prefixedKey = `${this.prefix}${key}`;
        const item = localStorage.getItem(prefixedKey);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('❌ Storage error:', error);
        return null;
      }
    }
  
    // Delete data
    removeItem(key) {
      try {
        const prefixedKey = `${this.prefix}${key}`;
        localStorage.removeItem(prefixedKey);
        console.log(`✅ Deleted: ${key}`);
        return true;
      } catch (error) {
        console.error('❌ Storage error:', error);
        return false;
      }
    }
  
    // Clear all
    clear() {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            localStorage.removeItem(key);
          }
        });
        console.log('✅ All data cleared');
        return true;
      } catch (error) {
        console.error('❌ Storage error:', error);
        return false;
      }
    }
  
    // Get all data
    getAll() {
      try {
        const result = {};
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            const cleanKey = key.replace(this.prefix, '');
            result[cleanKey] = this.getItem(cleanKey);
          }
        });
        return result;
      } catch (error) {
        console.error('❌ Storage error:', error);
        return {};
      }
    }
  
    // Get storage size
    getSize() {
      try {
        let size = 0;
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            size += localStorage.getItem(key).length;
          }
        });
        return (size / 1024).toFixed(2); // KB
      } catch (error) {
        return 0;
      }
    }
  }
  
  export const storage = new StorageManager();
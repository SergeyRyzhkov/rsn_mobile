class CacheEntry {
  value: any;
  createdAt: number;
  maxAge: number;

  constructor(value: any, maxAge: number) {
    this.value = value;
    this.createdAt = Date.now();
    this.maxAge = maxAge;
  }

  isExpaired() {
    return this.maxAge === 0 ? false : Date.now() - this.createdAt > this.maxAge;
  }
}

class MemoryCache {
  entriesMap = new Map<string, CacheEntry>();

  set(key: string, value: any, maxAge = 2000) {
    const entry = new CacheEntry(value, maxAge);
    this.entriesMap.set(key, entry);
  }

  get(key: string) {
    const entry = this.entriesMap.get(key);
    if (!!entry) {
      if (entry.isExpaired()) {
        entry.value = null;
        this.entriesMap.delete(key);
        return null;
      }
      return entry.value;
    }
    return null;
  }

  clear() {
    this.entriesMap.clear();
  }
}

export default new MemoryCache();

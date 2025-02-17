import { Injectable } from '@angular/core';

@Injectable()
export class PersistanceService {
  constructor() {}

  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key: string) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) {
          return null;  // o un valore predefinito, se necessario
        }
        return JSON.parse(item);
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }
}
// js/database.js
import Storage from './storage.js';

/**
 * DB class acts as the ORM/Data Access Layer
 */
class Database {
  constructor() {
    this.collections = ['alunos', 'avaliacoes', 'treinos', 'exercicios', 'configuracoes'];
    this.init();
  }

  // Initialize DB with empty arrays/objects if not exists, or load defaults
  async init() {
    for (const col of this.collections) {
      if (!Storage.get(col)) {
        if (col === 'configuracoes') {
          Storage.set(col, { personal: {} });
        } else {
          Storage.set(col, []);
        }
      }
    }
    await this.loadInitialMockData();
  }

  // Load initial data from data/ folder if collections are completely empty
  async loadInitialMockData() {
    try {
      const exercicios = Storage.get('exercicios');
      if (!exercicios || exercicios.length === 0) {
        const response = await fetch('./data/exercicios.json');
        if(response.ok) {
          const data = await response.json();
          Storage.set('exercicios', data.exercicios);
        }
      }

      const config = Storage.get('configuracoes');
      if (!config || Object.keys(config.personal).length === 0) {
        const response = await fetch('./data/configuracoes.json');
        if(response.ok) {
          const data = await response.json();
          Storage.set('configuracoes', data);
        }
      }
    } catch (e) {
      console.warn("Could not load initial mock data, continuing with empty collections.", e);
    }
  }

  generateId(prefix = 'ID') {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  // CRUD for collections
  getAll(collection) {
    return Storage.get(collection) || [];
  }

  getById(collection, id) {
    const data = this.getAll(collection);
    if(Array.isArray(data)) {
        return data.find(item => item.id === id) || null;
    }
    return null;
  }

  save(collection, item) {
    const data = this.getAll(collection);
    if (!item.id) {
      item.id = this.generateId(collection.substring(0,3).toUpperCase());
      data.push(item);
    } else {
      const index = data.findIndex(i => i.id === item.id);
      if (index !== -1) {
        data[index] = { ...data[index], ...item, updatedAt: new Date().toISOString() };
      } else {
        data.push(item);
      }
    }
    Storage.set(collection, data);
    return item;
  }

  delete(collection, id) {
    let data = this.getAll(collection);
    data = data.filter(item => item.id !== id);
    Storage.set(collection, data);
    return true;
  }

  getConfig() {
      return Storage.get('configuracoes');
  }

  saveConfig(config) {
      Storage.set('configuracoes', config);
  }

  exportDB() {
      const backup = {};
      this.collections.forEach(col => {
          backup[col] = Storage.get(col);
      });
      return JSON.stringify(backup);
  }
}

const DB = new Database();
export default DB;

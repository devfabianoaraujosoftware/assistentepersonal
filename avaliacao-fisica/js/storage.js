// js/storage.js
/**
 * Simple wrapper for LocalStorage to manage JSON objects
 */
const Storage = {
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Erro ao ler ${key} do Storage:`, e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Erro ao salvar ${key} no Storage (Quotum excedido?):`, e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  }
};

export default Storage;

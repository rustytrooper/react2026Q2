const STORAGE_KEY = 'searchValue';

export function trimValue(value: string) {
  return value.trim();
}

export function initializeSearchValue() {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    if (savedValue != null) {
      return savedValue;
    }
  } catch (e) {
    console.error('error while geting access to locale storage', e);
    throw e;
  }
}

export function saveSearchValue(searchTerm = '') {
  try {
    const trimmedValue = trimValue(searchTerm);
    localStorage.setItem(STORAGE_KEY, trimmedValue);
  } catch (e) {
    console.error('error while geting access to locale storage', e);
    throw e;
  }
}

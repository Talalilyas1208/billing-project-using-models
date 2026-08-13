import { useState, useEffect } from 'react';

/**
 * A custom hook that syncs React state with localStorage.
 *
 * @param {string} key - The localStorage key.
 * @param {*} initialValue - The default value if nothing is found in localStorage.
 * @returns {[*, Function]} - A stateful value and a setter function.
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;

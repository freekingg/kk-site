function useStorage() {
  const setLocalStorage = (obj) => {
    return new Promise((resolve) => {
      chrome.storage.local.set(obj, () => {
        resolve();
      });
    });
  };
  const getLocalStorage = (key) => {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (item) => {
        key ? resolve(item[key]) : resolve(item);
      });
    });
  };
  const setSyncStorage = (obj) => {
    return new Promise((resolve) => {
      chrome.storage.sync.set(obj, () => {
        resolve();
      });
    });
  };
  const getSyncStorage = (key) => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (item) => {
        key ? resolve(item[key]) : resolve(item);
      });
    });
  };
  const addStorangeChangeEventListener = (key, callback) => {
    chrome.storage.onChanged.addListener((change) => {
      callback(change?.[key]?.oldValue, change?.[key]?.newValue);
    });
  };
  return {
    setLocalStorage,
    getLocalStorage,
    setSyncStorage,
    getSyncStorage,
    addStorangeChangeEventListener
  };
}

export { useStorage as default };

import { reactive, toRefs, watchEffect } from 'vue';

type Checked = string | number | boolean;

type StoreType = {
  showURL: Checked;
  showFullParentPath: Checked;
};

const initStore = {
  showURL: true,
  showFullParentPath: true,
};

const store = reactive<StoreType>(initStore);
export default function useStore() {
  const setStore = (state: any) => {
    Object.assign(store, state);
  };

  const syncStorage = () => {
    chrome.storage.sync.set({ bookmarksSettings: store });
  };

  chrome.storage.sync.get(['bookmarksSettings'], (storage) => {
    if (storage.bookmarksSettings) {
      setStore(storage.bookmarksSettings);
    }
  });

  watchEffect(() => {
    syncStorage();
  });

  return {
    store,
    setStore,
    ...toRefs(store),
  };
}

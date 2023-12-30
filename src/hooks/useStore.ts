import { reactive, toRefs, watchEffect, onMounted } from 'vue';

type Checked = string | number | boolean;

export type StoreType = {
  showURL: Checked;
  showFullParentPath: Checked;
  enablePinyin: Checked;
};

const initStore = {
  showURL: true,
  showFullParentPath: true,
  enablePinyin: true,
};

const store = reactive<StoreType>(initStore);
export default function useStore() {
  const setStore = (state: any) => {
    Object.assign(store, state);
  };

  const syncStorage = () => {
    chrome.storage.sync.set({ bookmarksSettings: store });
  };

  onMounted(() => {
    chrome.storage.sync.get(['bookmarksSettings'], (storage) => {
      if (storage.bookmarksSettings) {
        setStore(storage.bookmarksSettings);
      }
    });
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

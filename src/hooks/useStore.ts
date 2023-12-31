import { reactive, toRefs, watch, onMounted } from 'vue';

type Checked = string | number | boolean;

export type StoreType = {
  showURL: Checked;
  showFullParentPath: Checked;
  enablePinyin: Checked;
  githubSync: {
    username: string;
    accessToken: string;
    repositoryName: string;
  };
};

const initStore: StoreType = {
  showURL: true,
  showFullParentPath: true,
  enablePinyin: true,
  githubSync: {
    username: '',
    accessToken: '',
    repositoryName: '',
  },
};

const store = reactive<StoreType>(initStore);
export default function useStore() {
  const setStore = (state: any) => {
    Object.assign(store, state);
  };

  onMounted(() => {
    chrome.storage.local.get(['bookmarksSettings'], (storage) => {
      if (storage.bookmarksSettings) {
        setStore(storage.bookmarksSettings);
      }
    });
  });

  watch(
    store,
    (newStore) => {
      chrome.storage.local.set({ bookmarksSettings: newStore });
    },
    {
      deep: true,
    },
  );

  return {
    store,
    setStore,
    ...toRefs(store),
  };
}

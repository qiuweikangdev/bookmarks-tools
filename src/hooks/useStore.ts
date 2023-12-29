import { reactive, toRefs } from 'vue';

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

  return {
    store,
    setStore,
    ...toRefs(store),
  };
}

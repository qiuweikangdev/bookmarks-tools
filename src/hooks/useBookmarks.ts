import { onMounted, ref } from 'vue';
import pinyin from 'pinyin';
export type BookmarksType = Pick<
  chrome.bookmarks.BookmarkTreeNode,
  'id' | 'title' | 'url'
> & {
  fullParentPath?: string;
  favicon?: string;
};
type BookmarksDirType = Record<string, BookmarksType[]>;

type FindBookmarkNodesType = {
  searchValue: string;
  enablePinyin: string | number | boolean;
};

export default function useBookmarks() {
  const bookmarks = ref<BookmarksType[]>([]);
  const bookmarksDir = ref<BookmarksDirType>({});
  const bookmarksTree = ref<any>([]);

  const getBookmarks = () => {
    chrome.bookmarks.getTree((tree) => {
      const treeData = tree[0].children || [];
      bookmarks.value = transformBookmarks(treeData);
      bookmarksTree.value = treeData;
      console.log('bookmarksTree', bookmarksTree.value);
    });
  };

  // google 服务来获取对应网站的 favicon 图标
  const getFaviconUrl = (url: string) => {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}`;
  };

  const transformBookmarks = (
    bookmarkNodes: chrome.bookmarks.BookmarkTreeNode[],
    parentFolder: string = '',
  ): BookmarksType[] => {
    const result: BookmarksType[] = [];

    for (const node of bookmarkNodes) {
      if (node.children) {
        const folderName = node.title || 'Untitled Folder';
        const newParentFolder = folderName;
        const fullParentPath = !parentFolder
          ? newParentFolder
          : `${parentFolder}/${newParentFolder}`;
        result.push(...transformBookmarks(node.children, fullParentPath));
      } else if (node.url) {
        const folderName = '';
        const fullParentPath = !parentFolder
          ? folderName
          : `${parentFolder}/${folderName}`;

        const formattedFullParentPath = fullParentPath
          .replace(/^书签栏\//, '')
          .replace(/\/$/, '');

        const faviconUrl = getFaviconUrl(node.url);

        result.push({
          id: node.id,
          title: node.title || '',
          url: node.url,
          fullParentPath: formattedFullParentPath,
          favicon: faviconUrl,
        });
      }
    }

    return result;
  };

  const findBookmarkNodes = ({
    searchValue,
    enablePinyin,
  }: FindBookmarkNodesType) => {
    const bookmarkNodes = bookmarks.value.filter((bookmark) => {
      if (enablePinyin) {
        return (
          bookmark.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          pinyin(bookmark.title, { style: pinyin.STYLE_NORMAL })
            .join('')
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        );
      } else {
        return bookmark.title.toLowerCase().includes(searchValue.toLowerCase());
      }
    });
    return bookmarkNodes;
  };

  onMounted(() => {
    getBookmarks();
  });

  return {
    bookmarks,
    bookmarksDir,
    bookmarksTree,
    transformBookmarks,
    findBookmarkNodes,
  };
}

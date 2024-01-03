import { onMounted, ref } from 'vue';
import pinyin from 'pinyin';

export type BookmarkTreeNodeType = chrome.bookmarks.BookmarkTreeNode;

export type BookmarksType = Pick<
  BookmarkTreeNodeType,
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
    });
  };

  // google 服务来获取对应网站的 favicon 图标
  const getFaviconUrl = (url: string) => {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}`;
  };

  const transformBookmarks = (
    bookmarkNodes: BookmarkTreeNodeType[],
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

  // 删除本地书签数据
  const removeBookmarks = (parentId: string): Promise<any> => {
    return new Promise<void>((resolve, reject) => {
      chrome.bookmarks.getChildren(parentId, (children) => {
        const promises = children.map((bookmark) => {
          return new Promise<void>((resolveBookmark) => {
            if (bookmark.parentId === '0') {
              removeBookmarks(bookmark.id)
                .then(() => resolveBookmark())
                .catch((error) => reject(error));
            } else {
              chrome.bookmarks.removeTree(bookmark.id, () => resolveBookmark());
            }
          });
        });

        Promise.all(promises)
          .then(() => resolve())
          .catch((error) => reject(error));
      });
    });
  };

  // 替换本地书签数据
  const replaceBookmarksTree = (bookmarkTree: BookmarkTreeNodeType[]) => {
    // 获取当前书签树
    chrome.bookmarks.getTree((tree) => {
      tree.forEach(async (rootFolder) => {
        if (rootFolder && rootFolder.id) {
          // 删除本地所有书签
          await removeBookmarks(rootFolder.id);
          // 创建新的书签树
          await createBookmarks(bookmarkTree);
        }
      });
    });
  };

  // 创建书签的方法
  const createBookmarks = async (
    bookmarkTree: BookmarkTreeNodeType[] = [],
    curId?: string,
  ) => {
    for (const bookmark of bookmarkTree) {
      const { title, url, children, id, parentId } = bookmark;
      if (parentId === '0') {
        await createBookmarks(children, id);
        continue;
      } else {
        const bookmarkTreeNode = await chrome.bookmarks.create({
          parentId: curId,
          title,
          url,
        });
        createBookmarks(children, bookmarkTreeNode.id);
      }
    }
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
    replaceBookmarksTree,
  };
}

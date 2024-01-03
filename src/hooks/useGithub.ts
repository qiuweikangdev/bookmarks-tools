import { Octokit } from '@octokit/rest';
import { createOrUpdateTextFile } from '@octokit/plugin-create-or-update-text-file';
import { StoreType } from './useStore';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import useBookmarks from './useBookmarks';

type GithubType = StoreType['githubSync'] & {
  path?: string;
};

type SyncBookmarksType = {
  bookmarksData: any[];
  commitMessage: string;
};
export default function useGithub({
  accessToken,
  username,
  repositoryName,
  path = 'bookmarks',
}: GithubType) {
  const syncLoading = ref(false);
  const downloadLoading = ref(false);
  const commitListLoading = ref(false);
  const versionLoading = ref(false);
  const { replaceBookmarksTree } = useBookmarks();

  const myOctokit = Octokit.plugin(createOrUpdateTextFile);
  const octokit = new myOctokit({ auth: accessToken });

  const getRepoInfo = async () => {
    // 获取仓库信息
    const { data: repoInfo } = await octokit.repos.get({
      owner: username,
      repo: repositoryName,
    });

    const defaultBranch = repoInfo.default_branch;
    return {
      defaultBranch,
    };
  };

  // 同步书签到github
  const syncBookmarks = async ({
    bookmarksData,
    commitMessage,
  }: SyncBookmarksType) => {
    try {
      syncLoading.value = true;

      const { defaultBranch } = await getRepoInfo();
      const content = JSON.stringify(bookmarksData);

      const { updated } = await octokit.createOrUpdateTextFile({
        owner: username,
        repo: repositoryName,
        path, // 提交的文件路径
        message: commitMessage, // commit
        content: content,
        branch: defaultBranch,
      });
      if (updated) {
        message.success('上传成功！');
      } else {
        message.warning('本地书签已最新,不需要上传同步！');
      }
    } catch (e: any) {
      message.error(e.toString());
    } finally {
      syncLoading.value = false;
    }
  };

  // 获取书签内容
  const getBookmarksContent = async (param = {}) => {
    const response = await octokit.repos.getContent({
      owner: username,
      repo: repositoryName,
      path,
      ...param,
    });

    const fileData = response.data as { content: string };

    // 解码 base64 字符串为二进制数据
    const binaryString = atob(fileData.content);
    const bytes = new Uint8Array(binaryString.length);

    // 防止乱码
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 解析 JSON 字符串
    const decodedContent = new TextDecoder('utf-8').decode(bytes);
    const bookmarksData = JSON.parse(decodedContent);

    return bookmarksData;
  };

  // 下载书签内容到本地
  const downloadBookmarks = async () => {
    downloadLoading.value = true;
    try {
      const bookmarksData = await getBookmarksContent();
      replaceBookmarksTree(bookmarksData);
      message.success('下载成功！');
    } catch (e: any) {
      message.error(e.toString());
    } finally {
      downloadLoading.value = false;
    }
  };

  // 获取commit记录列表
  const getCommitsList = async () => {
    try {
      commitListLoading.value = true;
      const { defaultBranch } = await getRepoInfo();
      const { data } = await octokit.repos.listCommits({
        owner: username,
        repo: repositoryName,
        ref: defaultBranch,
      });
      const list = (data || []).map((item) => ({
        value: item.sha,
        label: item.commit.message,
      }));
      return list;
    } catch (e: any) {
      message.error(e.toString());
    } finally {
      commitListLoading.value = false;
    }
  };

  const switchVersion = async (commitSha: string) => {
    if (commitSha) {
      try {
        versionLoading.value = true;
        const bookmarksData = await getBookmarksContent({ ref: commitSha });
        replaceBookmarksTree(bookmarksData);
        message.success('切换版本成功！');
      } catch (e: any) {
        message.error(e.toString());
      } finally {
        versionLoading.value = false;
      }
    }
  };

  return {
    syncLoading,
    downloadLoading,
    commitListLoading,
    versionLoading,
    syncBookmarks,
    downloadBookmarks,
    getCommitsList,
    switchVersion,
  };
}

import { Octokit } from '@octokit/rest';
import { createOrUpdateTextFile } from '@octokit/plugin-create-or-update-text-file';
import { StoreType } from './useStore';
import { ref } from 'vue';
import { message } from 'ant-design-vue';

type GithubType = StoreType['githubSync'];

type SyncBookmarksType = {
  bookmarksData: any[];
  commitMessage: string;
  path: string;
};
export default function useGithub({
  accessToken,
  username,
  repositoryName,
}: GithubType) {
  const syncLoading = ref(false);

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
    path,
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

  return {
    syncLoading,
    syncBookmarks,
  };
}

import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "tournament-web";

const nextConfig: NextConfig = {
  // 아래 두 줄은 서브 디렉토리 배포 시 필요 (예: https://username.github.io/레포이름)
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
};

export default nextConfig;

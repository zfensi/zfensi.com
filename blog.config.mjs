import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

const blogConfig = {
  siteName: 'ZFensi',
  siteUrl: 'https://zfensi.vercel.app',
  description:
    'zfensi 聚焦 Instagram、TikTok、Telegram 等社交媒体增长话题，整理平台认知、内容策略与实操观察。',
  defaultOgImage: '/og-cover.svg',
  author: 'zfensi',
  interlink: {
    relatedPostsLimit: 5,
    blockedDomains: ['spam.example', 'bad-neighbor.example'],
  },
  images: {
    outputDir: path.join(repoRoot, 'public', 'images', 'blog'),
    publicBasePath: '/images/blog',
    width: 1200,
    height: 630,
  },
  automation: {
    sourceDir: path.join(repoRoot, 'content', 'inbox'),
    deleteAfterMove: false,
    repoMap: {
      auto: {
        rootDir: repoRoot,
        contentDir: 'src/content/blog',
        branch: 'main',
      },
    },
  },
};

export default blogConfig;

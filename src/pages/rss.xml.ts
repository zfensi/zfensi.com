import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import blogConfig from '../../blog.config.mjs';
import { getPostUrl, sortPosts, toAbsoluteUrl } from '../lib/blog';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection('blog'));
  const feedUrl = toAbsoluteUrl('/rss.xml');
  const lastBuildDate = posts[0]?.data.date.toUTCString() ?? new Date().toUTCString();

  const items = posts.map((post) => {
    const link = toAbsoluteUrl(getPostUrl(post));
    const categories = [post.data.category, ...post.data.tags]
      .filter(Boolean)
      .map((value) => `    <category>${escapeXml(value)}</category>`)
      .join('\n');

    return [
      '  <item>',
      `    <title>${escapeXml(post.data.title)}</title>`,
      `    <link>${escapeXml(link)}</link>`,
      `    <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      `    <pubDate>${post.data.date.toUTCString()}</pubDate>`,
      `    <description>${escapeXml(post.data.description)}</description>`,
      categories,
      '  </item>',
    ]
      .filter(Boolean)
      .join('\n');
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(blogConfig.siteName)}</title>`,
    `    <description>${escapeXml(blogConfig.description)}</description>`,
    `    <link>${escapeXml(blogConfig.siteUrl)}</link>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    `    <language>${escapeXml('zh-cn')}</language>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};

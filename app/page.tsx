import React from 'react';
import { getSortedPostsData } from '@/lib/posts';
import BlogInsights from './components/BlogInsights';

export const dynamic = 'force-dynamic';

export default function Home() {
  const posts = getSortedPostsData();

  const formattedPosts = posts.map(post => {
    // Extract first image src in post body if any
    const imgMatch = post.contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    const thumbnail = imgMatch 
      ? imgMatch[1] 
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

    return {
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      readTime: post.readTime,
      tags: post.tags || [],
      date: post.date,
      image: thumbnail,
    };
  });

  return (
    <>
      <BlogInsights posts={formattedPosts} />
    </>
  );
}

import React from 'react';
import { getSortedPostsData, getPostData } from '@/lib/posts';
import NewPostForm from './NewPostForm';

interface NewPostPageProps {
  searchParams: Promise<{
    slug?: string;
  }>;
}

// Since this is a server component, we can use Node fs via lib/posts safely.
export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const posts = getSortedPostsData();
  
  // Extract all unique tags
  const availableTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  const { slug } = await searchParams;
  let initialPost = null;

  if (slug) {
    const post = getPostData(slug);
    if (post) {
      // Extract ISO date for <input type="date"> (format: YYYY-MM-DD)
      const dateVal = post.date 
        ? new Date(post.date).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];
        
      initialPost = {
        slug: post.slug,
        title: post.title,
        date: dateVal,
        tags: post.tags || [],
        excerpt: post.excerpt || '',
        content: post.contentHtml || '',
      };
    }
  }

  return <NewPostForm availableTags={availableTags} initialPost={initialPost} />;
}

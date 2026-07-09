import React from 'react';
import { getSortedPostsData } from '@/lib/posts';
import NewPostForm from './NewPostForm';

// Since this is a server component, we can use Node fs via lib/posts safely.
export default function NewPostPage() {
  const posts = getSortedPostsData();
  
  // Extract all unique tags
  const availableTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  return <NewPostForm availableTags={availableTags} />;
}

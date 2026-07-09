import React from 'react';
import { getSortedPostsData } from '@/lib/posts';
import AdminDashboard from './AdminDashboard';

// This is a Server Component, so it can securely load file data via lib/posts.ts
export default function AdminPage() {
  const posts = getSortedPostsData();

  // Format data cleanly to pass to client component
  const formattedPosts = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    dateString: post.dateString,
    tags: post.tags || [],
    fileType: post.fileType,
  }));

  return <AdminDashboard posts={formattedPosts} />;
}

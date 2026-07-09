import React from 'react';
import { getSortedPostsData } from '@/lib/posts';
import BlogListClient from './BlogListClient';

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <>
      <div className="hero">
        <h2>AI-up Insights</h2>
        <p>Hành trình học tập, nghiên cứu và phát triển trong thế giới AI Engineering & Agentic Workflow.</p>
      </div>
      <BlogListClient posts={posts} />
    </>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - AI-up',
  description: 'Quản lý bài viết và AI Assistant',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

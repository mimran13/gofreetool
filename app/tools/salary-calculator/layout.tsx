import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools';
import { generateMetadata as generateMeta } from '@/lib/seo';

const tool = getToolBySlug('salary-calculator');

export const metadata: Metadata = tool
  ? generateMeta(tool.seo.title, tool.seo.description, tool.seo.keywords, `/tools/${tool.slug}`)
  : {};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

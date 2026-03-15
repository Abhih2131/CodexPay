import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WorkplaceAI | Pay Insights',
  description: 'CTC-to-net salary breakdown with tax transparency'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

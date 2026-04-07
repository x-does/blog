import './globals.css';

export const metadata = {
  title: 'xdoes blog editor',
  description: 'Local markdown editor + sqlite publisher',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Lightning Lab | Commercial & Residential LED Lighting',
  description: 'The Lightning Lab offers high quality LED lighting solutions for commercial and residential spaces, both indoor and outdoor. Bulk discounts, DLC Premium & UL Listed fixtures.',
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,600;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-[#B32318] selection:text-white">
        {children}
      </body>
    </html>
  );
}

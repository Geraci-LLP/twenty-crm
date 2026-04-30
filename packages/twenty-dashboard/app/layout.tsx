import { Inter } from 'next/font/google';
import { ApolloProviderWrapper } from '../lib/apollo-provider';
import './globals.css';

// Inter is the de-facto SaaS UI font — pairs cleanly with the existing
// Twenty CRM aesthetic. `next/font/google` self-hosts the file at build
// time so we don't ship the user a Google fonts request on every page.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Geraci LLP Dashboards',
  description: 'Custom report builder powered by Twenty CRM data.',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;

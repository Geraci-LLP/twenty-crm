import { ApolloProviderWrapper } from '../lib/apollo-provider';
import './globals.css';

export const metadata = {
  title: 'Twenty Dashboards',
  description: 'Custom report builder for Twenty CRM',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;

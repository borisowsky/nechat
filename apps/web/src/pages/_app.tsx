import { NextPage } from 'next';
import { AppProps } from 'next/app';
import 'normalize.css/normalize.css';

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;

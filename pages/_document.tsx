import Document, { Html, Head, Main, NextScript } from "next/document";
import { createGetInitialProps } from "@mantine/next";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;
  render() {
    return (
      <Html>
        <Head lang="en">
          <meta charSet="utf-8" />
          <meta name="og:description" content="pomotech - pomodoro timer" />
          <meta name="description" content="pomotech - pomodoro timer" />
          <meta property="og:image" content="opengraph.png"></meta>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <div id="root" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

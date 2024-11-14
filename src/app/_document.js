import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta content="yes" name="apple-mobile-web-app-capable" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta content="yes" name="apple-mobile-web-app-capable" />

                    <link rel="manifest" href="manifest.json" />
                    <script type="module">
                        import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';
                        const el = document.createElement('pwa-update');
                        document.body.appendChild(el);
                    </script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument

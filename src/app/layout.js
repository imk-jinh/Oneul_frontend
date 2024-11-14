import './globals.css';
import { ChatProvider } from './ChatContext';
import { UnreadProvider } from './UnreadContext';
import NotificationBar from './NotificationBar';
import Script from 'next/script';

export const metadata = {
  title: '오늘 : About Today',
  description: 'Lets go',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="images/152x152.png" />
        <link rel="manifest" href="manifest.json" />
        <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js" integrity="sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJXVJZUkTk/oX4U9GhUIs3/z8" crossOrigin="anonymous"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      </head>
      <body>
        <ChatProvider>
          <UnreadProvider>
            <NotificationBar />
            {children}
          </UnreadProvider>
        </ChatProvider>

        {/* PWA 업데이트 스크립트 */}
        <Script
          id="pwa-update"
          type="module"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';
              const el = document.createElement('pwa-update');
              document.body.appendChild(el);
            `,
          }}
        />
      </body>
    </html>
  );
}

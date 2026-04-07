import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_TAGLINE } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: 'de9TSsBBneQps0DJ0It1vzBsUTeGLGOoqqjAvSsx3fI',
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['AI뉴스', '인공지능', '머신러닝', 'ChatGPT', '로보틱스', '미래예측', 'LLM', '딥러닝', '자율주행', '양자컴퓨팅', '생성AI', 'OpenAI', 'Google DeepMind'],
  alternates: { canonical: SITE_URL },
  openGraph: {
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  inLanguage: 'ko',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* AdSense 소유권 확인 및 광고 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3012911913573742"
          crossOrigin="anonymous"
        />
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-8760R71HNS"
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8760R71HNS');
        `}
      </Script>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

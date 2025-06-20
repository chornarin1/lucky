import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import './globals.css'

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Spin the Wheel - Random Name Picker & Decision Maker Tool',
  description: 'Free spin the wheel name picker tool. Create custom wheels for random selection, classroom activities, team picking, and decision making. No signup required!, Wheel of Names is a free online spinner tool for classrooms, raffles, meetings, and fun decision making.',
  keywords: 'spin the wheel, random name picker, wheel of names, name picker wheel, random picker, spin wheel generator, wheel spinner, random name selector, decision wheel, picker wheel, name generator wheel, random wheel, spinning wheel names, wheel of fortune names, name picker tool, random name generator, classroom name picker, team picker wheel, decision maker wheel, prize wheel, raffle wheel, random selector tool, spin to decide, wheel randomizer, online spinner, free name picker, custom wheel maker, random choice maker, spin wheel online, name wheel spinner, random decision maker, wheel of choices, lucky wheel, digital spinner, virtual wheel, interactive wheel, name randomizer, pick random name, spin for winner, random team generator, classroom spinner, educational wheel, teacher tools, student picker, group selector, winner picker, contest wheel, giveaway wheel, fair picker, unbiased selector, transparent picker, Wheel of Names, spinner, random name picker, spin wheel, random winner, classroom, teacher tool, raffle, customizable wheel, save and share wheels, renewable energy, sustainability, presentation tool, standup meeting, decision making tool, to-do list spinner, dinner decision wheel, lucky draw, online wheel spinner, education tool, free spinner tool, easy to use',
  authors: [{ name: 'CHOR NARIN' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'Free Spin the Wheel - Random Name Picker & Decision Maker',
    description: 'Create custom spinning wheels for random name picking, classroom activities, and decision making. Free, fast, and no registration required!',
    images: [
      {
        url: 'https://ext.same-assets.com/3144032977/1602066237.png',
        width: 1200,
        height: 630,
        alt: 'Spin the Wheel Logo',
      },
    ],
    siteName: 'Spin the Wheel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Spin the Wheel - Random Name Picker Tool',
    description: 'Free online wheel spinner for random name picking and decision making. Perfect for classrooms, contests, and everyday choices!',
    images: ['https://ext.same-assets.com/3144032977/1602066237.png'],
  },
  icons: {
    icon: 'https://ext.same-assets.com/3144032977/1602066237.png',
    shortcut: 'https://ext.same-assets.com/3144032977/1602066237.png',
    apple: 'https://ext.same-assets.com/3144032977/1602066237.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Spin the Wheel - Random Name Picker",
              "description": "Free online tool for spinning wheels to pick random names, make decisions, and select winners",
              "url": "https://yoursite.com",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "CHOR NARIN"
              }
            })
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-K4VVCS6YZL"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-K4VVCS6YZL');
            `,
          }}
        />
      </head>
      <body className={quicksand.className}>
        {children}
      </body>
    </html>
  )
}
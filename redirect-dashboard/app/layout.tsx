import './globals.css'
import type { Metadata } from 'next'
export const metadata:Metadata={title:'Redirect Manager',description:'Central redirect management dashboard'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}

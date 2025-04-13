import type { Metadata } from "next"
import "./globals.scss"
import React from "react"
import {ApolloWrapper} from "@/app/ApolloWrapper"

export const metadata: Metadata = {
  title: "Shotlist Tool",
  description: "A free and open source, no-ai, clean and simple shotlist creation tool for filmmakers"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname()
  const isReadPage = pathname?.startsWith('/books/read')

  if (isReadPage) return null

  return <Navbar />
}

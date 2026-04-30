// Error page: displays an error message and a link to go back to the meals page.

"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="error background-gradient">
      <div className="containerTopNavbarColor" />
      <h1 className="highlight-text">Failed to fetch meals data. </h1>
      <p>Please try again later or contact support.</p>
      <Link href="/meals" className="theme-accent-gold-blue">Back to Meals</Link>
    </main>
  )
}
"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="error mainBackground">
      <div className="containerTopNavbarColor" />
      <p>Failed to create meal. Please try again later or contact support.</p>
      <Link href="/meals/share" className="theme-accent-gold-blue">
        Back to Share a Meal
      </Link>
    </main>
  )
}
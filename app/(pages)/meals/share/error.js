"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="error">
      <p>Failed to create meal. Please try again later or contact support.</p>
      <Link href="/meals/share">
        Back to Share a Meal
      </Link>
    </main>
  )
}
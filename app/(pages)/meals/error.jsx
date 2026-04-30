// Error page: displays an error message and a link to go back to the meals page.

"use client";

import { Button } from "@/components/ui/button/Button";

export default function ErrorPage() {
  return (
    <main className="error background-gradient">
      <div className="containerTopNavbarColor" />
      <h1 className="highlight-text">Failed to fetch meals data. </h1>
      <p>Please try again later or contact support.</p>
      <Button href="/meals" variant="brand">Back to Meals</Button>
    </main>
  )
}

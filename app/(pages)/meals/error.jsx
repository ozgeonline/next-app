"use client";

import { Button } from "@/components/ui/button/Button";

export default function ErrorPage() {
  return (
    <main className="error background-gradient">
      <div className="containerTopNavbarColor" />
      <h1 className="highlight-text">Failed to fetch meals data. </h1>
      <p>Please try again later or contact support.</p>
      <Button href="/meals" variant="primary">Back to Meals</Button>
    </main>
  );
}

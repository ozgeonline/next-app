"use client";

import { Button } from "@/components/ui/button/Button";

export default function ErrorPage() {
  return (
    <main className="error mainBackground">
      <div className="containerTopNavbarColor" />
      <p>Failed to create meal. Please try again later or contact support.</p>
      <Button href="/meals/share" variant="primary">
        Back to Share a Meal
      </Button>
    </main>
  );
}

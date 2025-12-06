import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found background-gradient">
      <div className="containerTopNavbarColor" />
      <h1>Not Found</h1>
      <p>Could not find requested resource.</p>
      <Link href="/meals/share" className="text-gold-on-dark">
        Share a Meal
      </Link>
    </main>
  )
}
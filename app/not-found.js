import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Not Found</h1>
      <p>Could not find requested resource.</p>
      <Link href="/" className="not-found">
        Return Home
      </Link>
    </main>
  )
}
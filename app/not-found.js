import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found mainBackground">
      <div className="containerTopNavbar" />
      <h1>Not Found</h1>
      <p>Could not find requested resource.</p>
      <Link href="/" className="">
        Return Home
      </Link>
    </main>
  )
}
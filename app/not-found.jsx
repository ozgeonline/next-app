import { Button } from "@/components/ui/button/Button";

export default function NotFound() {
  return (
    <main className="not-found background-gradient">
      <div className="containerTopNavbarColor" />
      <h1>Not Found</h1>
      <p>Could not find requested resource.</p>
      <Button href="/" variant="accent">
        Return Home
      </Button>
    </main>
  )
}

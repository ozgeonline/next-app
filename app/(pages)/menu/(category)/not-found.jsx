import { Button } from "@/components/ui/button/Button";

export default function NotFound() {
  return (
    <main className="not-found background-gradient">
      <div className="containerTopNavbarColor" />
      <h1>Menu Category Not Found</h1>
      <p>The category you are looking for does not exist or has been moved.</p>
      <Button
        href="/menu"
        variant="accent"
        style={{ padding: '0.75rem 2rem', borderRadius: '30px', textDecoration: 'none' }}
      >
        Back to Full Menu
      </Button>
    </main>
  )
}

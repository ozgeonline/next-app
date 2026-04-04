import AuthForm from "@/components/forms/auth/AuthForm";

export const metadata = {
  title: "Log In | TasteShare",
  description: "Log in to your TasteShare account to save recipes, join the community, and share your favorite culinary creations.",
  keywords: ["login", "TasteShare account", "food community", "recipe sharing", "culinary"],
  openGraph: {
    title: "Log In | TasteShare",
    description: "Welcome back to TasteShare. Log in to access your saved recipes and community features.",
  }
}

export default function LoginPage() {
  return (
    <AuthForm
      formType="login"
      referencePath="signup"
    />
  );
}
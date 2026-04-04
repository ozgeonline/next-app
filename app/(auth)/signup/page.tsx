import AuthForm from "@/components/forms/auth/AuthForm";

export const metadata = {
  title: "Sign Up | TasteShare",
  description: "Join TasteShare today. Create a free account to discover, save, and share unique recipes with a passionate food community.",
  keywords: ["sign up", "register", "TasteShare account", "join food community", "share recipes"],
  openGraph: {
    title: "Sign Up | TasteShare",
    description: "Create your free TasteShare account and start sharing your favorite culinary creations with the world.",
  }
}
export default function SignupPage() {
  return (
    <AuthForm
      formType="signup"
      referencePath="login"
    />
  );
}
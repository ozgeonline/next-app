import AuthForm from "@/components/forms/auth/AuthForm";

export const metadata = {
  title: "Login",
  description: "Log in and share unique recipes.",
  keywords: "Taste, food, recipes, community"
}

export default function LoginPage() {
  return (
    <AuthForm
      formType="login"
      fetchApiPath="login"
      referencePath="signup"
      nonTokenPath="/profile"
    />
  );
}
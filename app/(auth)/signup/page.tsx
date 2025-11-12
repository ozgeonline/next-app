import AuthForm from "@/components/forms/auth/AuthForm";

export const metadata = {
  title: "Sign Up",
  description: "Create an account and share unique recipes.",
  keywords: "TasteShare, food, recipes, community"
}
export default function SignupPage() {
  return (
    <AuthForm
      formType="signup"
      fetchApiPath="signup"
      referencePath="login"
      nonTokenPath="/profile"
    />
  );
}
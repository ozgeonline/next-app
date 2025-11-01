import AuthForm from "@/components/forms/auth/AuthForm";
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
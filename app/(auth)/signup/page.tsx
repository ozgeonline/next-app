import AuthForm from "@/components/forms/auth/AuthForm";
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
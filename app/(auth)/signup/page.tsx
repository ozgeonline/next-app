import AuthForm from "@/components/ui/actions/form/auth/AuthForm";
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
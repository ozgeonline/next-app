import AuthForm from '@/components/ui/actions/form/auth/AuthForm';

export default function LoginPage() {
  return (
    <AuthForm 
      formType="login" 
      fetchApiPath="login" 
      nonTokenPath="/signup" 
      referencePath='signup'
    />
  );
}

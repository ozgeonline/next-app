import ForgotPasswordForm from "@/components/forms/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | TasteShare",
  description: "Request a secure password reset link for your TasteShare account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

import ResetPasswordForm from "@/components/forms/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | TasteShare",
  description: "Choose a new password for your TasteShare account.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return <ResetPasswordForm token={token} />;
}

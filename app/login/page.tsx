import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import { SignupFormDemo } from "../(dashboard)/dashboard/components/SignupFormDemo";

const LoginPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <SignupFormDemo />
    </div>
  );
};

export default LoginPage;

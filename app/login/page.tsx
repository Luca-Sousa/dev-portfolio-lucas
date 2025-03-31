import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import SignInForm from "./components/sign-in-form";

const LoginPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-black-100 p-6 md:p-10">
      <SignInForm />
    </div>
  );
};

export default LoginPage;

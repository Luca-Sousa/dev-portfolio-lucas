"use client";

import React from "react";
import { IconBrandGoogle, IconLogin2 } from "@tabler/icons-react";
import { Label } from "@/app/components/ui/label-aceternity";
import { Input } from "@/app/components/ui/input-aceternity";
import { cn } from "@/app/lib/utils";
import { signIn } from "next-auth/react";

const SignInForm = () => {
  const handleLoginWithGoogleClick = () => signIn("google");

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-black-200 p-4 shadow-input md:p-8">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Login Dashboard
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Área administrativa exclusiva de acesso.
      </p>

      <form className="my-8">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="Informe o email" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <button
          className="group/btn relative flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-black to-neutral-600 py-2.5 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Login
          <IconLogin2 size={20} />
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <button
          className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-zinc-900 px-4 font-medium text-black shadow-input dark:shadow-[0px_0px_1px_1px_#262626]"
          type="button"
          onClick={handleLoginWithGoogleClick}
        >
          <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
          <span className="text-sm text-neutral-300">Google</span>
          <BottomGradient />
        </button>
      </form>
    </div>
  );
};

export default SignInForm;

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

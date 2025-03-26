"use client";

import Link from "next/link";
import { ReactNode } from "react";
import MagicButton from "./magic-button";

interface ButtonLinksPros {
  icon: ReactNode;
  link: string;
  title: string;
}

export function ButtonLinks({ link, icon, title }: ButtonLinksPros) {
  return (
    <Link href={link}>
      <MagicButton icon={icon} position="left" title={title} />
    </Link>
  );
}

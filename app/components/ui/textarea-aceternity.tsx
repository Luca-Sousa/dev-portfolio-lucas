/* eslint-disable @typescript-eslint/no-explicit-any */
// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input
"use client";

import * as React from "react";
import { cn } from "@/app/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export type TextAreaProps = React.InputHTMLAttributes<HTMLTextAreaElement>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    const radius = 100; // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = React.useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }
    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          #cbacf9,
          transparent 80%
        )
      `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[2px] transition duration-300"
      >
        <textarea
          // type={type}
          className={cn(
            `dark:placeholder-text-neutral-600 duration-400 flex w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black shadow-input transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-300 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:shadow-none dark:bg-black-200 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-400`,
            className,
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  },
);
TextArea.displayName = "TextArea";

export { TextArea };

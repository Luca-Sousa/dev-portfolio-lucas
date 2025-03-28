"use client";

import { cn } from "@/app/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    title: string;
    type: string;
    institution: string;
    date_duration: string;
    description: string;
    img: string;
    link: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);

  useEffect(() => {
    const getDirection = () => {
      if (containerRef.current) {
        if (direction === "left") {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "forwards",
          );
        } else {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "reverse",
          );
        }
      }
    };

    const getSpeed = () => {
      if (containerRef.current) {
        if (speed === "fast") {
          containerRef.current.style.setProperty("--animation-duration", "20s");
        } else if (speed === "normal") {
          containerRef.current.style.setProperty("--animation-duration", "40s");
        } else {
          containerRef.current.style.setProperty("--animation-duration", "80s");
        }
      }
    };

    function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });

        getDirection();
        getSpeed();
        setStart(true);
      }
    }

    addAnimation();
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-screen overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-16 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          // adicionei o border-b
          <li
            className="relative w-[90vw] max-w-full flex-shrink-0 rounded-2xl border border-slate-800 p-5 md:w-[60vw] md:p-10"
            style={{
              background: "rgb(4,7,29)",
              backgroundColor:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}
            key={idx}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <div className="relative z-20 flex flex-row items-center">
                <div className="me-3">
                  <Link href={item.link} target="_blank">
                    <Image
                      src={item.img}
                      alt="profile"
                      width={64}
                      height={64}
                      className="rounded-full transition-all hover:scale-110"
                    />
                  </Link>
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h1 className="relative z-20 text-sm font-bold leading-[1.6] text-white md:text-lg xl:text-xl">
                      {item.title}
                    </h1>

                    <Link href={item.link} target="_blank">
                      <p className="relative z-20 font-semibold text-purple hover:underline">
                        {item.institution}
                      </p>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="relative z-20 text-xs font-normal leading-[1.6] text-white-200 md:text-sm">
                      {item.type}
                    </span>

                    <span className="relative z-20 text-xs font-normal leading-[1.6] text-white-200 md:text-lg">
                      {item.date_duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-20 mt-6 flex w-full flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-normal leading-[1.6] text-white md:text-base lg:text-xl">
                    {item.description}
                  </span>
                  {/* <span className=" text-sm leading-[1.6] text-white-200 font-normal">
                    {item.title}
                  </span> */}
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};

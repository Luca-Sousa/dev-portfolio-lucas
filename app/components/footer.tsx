/* eslint-disable @next/next/no-img-element */

import { socialMedia } from "../data";
import Link from "next/link";
import Image from "next/image";
import Contact from "./contact";

interface FooterProps {
  isPages?: boolean;
}

const Footer = ({ isPages }: FooterProps) => {
  return (
    <footer className={`w-full pb-10 ${!isPages && "pt-10"} `} id="contact">
      {/* background grid */}
      <div className="absolute -bottom-72 left-0 min-h-28 w-full">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="h-full w-full opacity-50"
        />
      </div>

      {!isPages && <Contact />}

      <div className="mt-16 flex flex-col items-center justify-between md:flex-row">
        <p className="text-sm font-light md:text-base md:font-normal">
          Copyright © 2025 Lucas Sousa
        </p>

        <div className="mt-6 flex items-center gap-6 md:mt-0 md:gap-3">
          {socialMedia.map((info) => (
            <div
              key={info.id}
              className="saturate-180 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-black-300 bg-black-200 bg-opacity-75 backdrop-blur-lg backdrop-filter"
            >
              <Link href={info.link} target="_blank">
                <Image src={info.img} alt="icons" width={20} height={20} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

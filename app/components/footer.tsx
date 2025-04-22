"use client";
import SocialMediaLink from "../(home)/components/social-media-link";
/* eslint-disable @next/next/no-img-element */

import { socialMedia } from "../data";
import Contact from "./contact";

interface FooterProps {
  isPages?: boolean;
}

const Footer = ({ isPages }: FooterProps) => {
  return (
    <footer className={`w-full pb-10 ${!isPages && "pt-10"} `} id="contact">
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
            <SocialMediaLink key={info.id} socialMedia={info} isIcon />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

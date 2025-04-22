import Image from "next/image";
import Link from "next/link";

const SocialMediaLink = ({
  socialMedia,
  isIcon,
}: {
  socialMedia: {
    img: string;
    title: string;
    link: string;
  };
  isIcon?: boolean;
}) => {
  return (
    <Link
      href={socialMedia.link}
      target="_blank"
      className={`${isIcon ? "w-10 border-black-300 px-0" : "flex w-fit items-center justify-center gap-2 border-black-200 px-3"} saturate-180 flex h-10 cursor-pointer items-center justify-center rounded-lg border bg-black-200 bg-opacity-75 backdrop-blur-lg backdrop-filter transition-colors hover:border-black-300 hover:bg-black-300`}
    >
      <Image src={socialMedia.img} alt="icons" width={20} height={20} />
      {!isIcon && <span>{socialMedia.title}</span>}
    </Link>
  );
};

export default SocialMediaLink;

"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

interface CarouselImagesProjectProps {
  project: string[];
}

const CarouselImagesProject = ({ project }: CarouselImagesProjectProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-3xl"
        setApi={setApi}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {project.map((imageURL, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden">
                <CardContent className="relative flex aspect-video size-full items-center justify-center p-0">
                  <Image
                    src={imageURL}
                    alt={`Imagem ${index}`}
                    className="rounded-lg object-cover object-top"
                    fill
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 hidden size-9 text-purple ring-2 ring-purple hover:scale-110 hover:bg-purple/20 lg:flex 2xl:-left-12" />
        <CarouselNext className="right-3 hidden size-9 text-purple ring-2 ring-purple hover:scale-110 hover:bg-purple/20 lg:flex 2xl:-right-12" />
      </Carousel>

      <div className="py-2.5 text-center text-sm text-muted-foreground">
        Imagem {current} de {count}
      </div>
    </div>
  );
};

export default CarouselImagesProject;

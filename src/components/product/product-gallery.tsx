"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Media } from "@/lib/commerce/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: Media[];
  videos?: Media[];
  alt: string;
}

export function ProductGallery({ images, videos, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const displayImages = images.length > 0 ? images : [{ url: "/placeholder.png", alt, type: "image" as const }];
  const currentImage = displayImages[activeIndex] ?? displayImages[0];
  const hasVideos = Boolean(videos && videos.length > 0);
  const firstVideo = videos?.[0];

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
    }
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 items-start w-full">
      {/* Thumbnails strip */}
      <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-w-full lg:max-h-[550px] shrink-0 p-1 scrollbar-none">
        {displayImages.map((img, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={`${img.url}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative size-16 rounded-md border overflow-hidden shrink-0 transition-all bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black",
                isSelected
                  ? "border-black ring-2 ring-black"
                  : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
              )}
              aria-label={`View image ${idx + 1} of ${displayImages.length}`}
              aria-pressed={isSelected}
            >
              <Image
                src={img.url}
                alt={img.alt || `${alt} thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          );
        })}

        {/* Video thumbnail slot if present */}
        {hasVideos && firstVideo && (
          <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="relative size-16 rounded-md border border-gray-200 hover:border-black overflow-hidden shrink-0 transition-all bg-gray-50 flex items-center justify-center group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
                aria-label="Play product video"
              >
                <div className="size-8 rounded-full bg-white shadow-xs flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                  <Play className="size-4 fill-current ml-0.5" />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl p-4 bg-white">
              <DialogHeader>
                <DialogTitle>{firstVideo.alt || "Product Video"}</DialogTitle>
              </DialogHeader>
              <div className="aspect-video w-full rounded-md overflow-hidden bg-black mt-2">
                <video
                  src={firstVideo.url}
                  controls
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Main image container */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="group relative aspect-square w-full rounded-lg border border-gray-200 bg-white overflow-hidden cursor-crosshair focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black"
        aria-label="Product main image. Use left and right arrow keys to cycle images."
      >
        {/* Sale badge */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-0.5 rounded tracking-wide uppercase shadow-xs">
            Sale
          </span>
        </div>

        <Image
          key={currentImage.url}
          src={currentImage.url}
          alt={currentImage.alt || alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={activeIndex === 0}
          className="object-contain p-6 transition-transform duration-300 group-hover:[transform:scale(1.25)] will-change-transform"
        />
      </div>
    </div>
  );
}

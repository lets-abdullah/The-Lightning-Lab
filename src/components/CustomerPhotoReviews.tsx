'use client';

import React, { useRef } from 'react';
import { Star, ChevronRight } from 'lucide-react';

interface PhotoReview {
  id: string;
  image: string;
  quote: string;
  author: string;
}

export default function CustomerPhotoReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const reviews: PhotoReview[] = [
    {
      id: "pr1",
      image: "/images/8-Picsart-AiImageEnhancer_640x.jpg",
      quote: "I purchased these LED sheets and was very happy with the result...",
      author: "Migual"
    },
    {
      id: "pr2",
      image: "/images/1-Picsart-AiImageEnhancer_640x.jpg",
      quote: "It is amazing how much lightning has advanced over the...",
      author: "troy"
    },
    {
      id: "pr3",
      image: "/images/2x4_led_troffer_5_wattages_selectable_at_switchtoled_640x.jpeg",
      quote: "These 2x4 LED flat panel lights completely changed the look of...",
      author: "Rachel"
    },
    {
      id: "pr4",
      image: "/images/led_flat_panel_lights_640x.jpeg",
      quote: "Love these led lights. Super light weight and easy to install Highly...",
      author: "Wendy"
    },
    {
      id: "pr5",
      image: "/images/ufo-led-high-bay-light-single-fixture-plug-play-150w-120w-100w_640x.jpg",
      quote: "These lights are awesome, they have a 5 year warranty. I...",
      author: "Logan"
    }
  ];

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative">
        
        {/* 5-Card Horizontal Row / Scrollable Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              {/* Photo Area - Full Uncropped */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                <img
                  src={rev.image}
                  alt={rev.author}
                  className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Text & Rating Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* 5 JudgemeStar Stars */}
                  <div className="flex items-center gap-0.5 text-[#f59e0b] mb-2.5">
                    <span className="judgemestar text-[#f59e0b] text-sm select-none">
                      &#9733;&#9733;&#9733;&#9733;&#9733;
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-gray-800 leading-snug line-clamp-2">
                    {rev.quote}
                  </p>
                </div>

                {/* Author Name */}
                <div className="mt-4 pt-2">
                  <span className="text-xs text-gray-500 font-medium">
                    {rev.author}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Navigation Pill */}
        <button
          type="button"
          onClick={handleScrollRight}
          className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-gray-800 border border-gray-200 shadow-md items-center justify-center hover:bg-gray-50 transition-all z-10"
          aria-label="Next Reviews"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

      </div>
    </section>
  );
}

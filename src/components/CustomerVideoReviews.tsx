'use client';

import React, { useState } from 'react';
import { Play, Volume2, ArrowLeft, ArrowRight } from 'lucide-react';
import { reviewVideos } from '../data/storeData';

export default function CustomerVideoReviews() {
  const [scrollIndex, setScrollIndex] = useState(0);

  const handlePrev = () => {
    setScrollIndex((prev) => (prev > 0 ? prev - 1 : reviewVideos.length - 1));
  };

  const handleNext = () => {
    setScrollIndex((prev) => (prev < reviewVideos.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Centered Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#111] tracking-tight uppercase text-center mb-8 sm:mb-10 font-montserrat">
          OUR CUSTOMER REVIEWS
        </h2>

        {/* Video Cards Grid / Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {reviewVideos.map((video) => (
            <div
              key={video.id}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[9/16] bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 select-none"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay tint */}
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors" />

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-95"
                  aria-label="Play Video"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5 text-white" />
                </button>
              </div>

              {/* Bottom Right Mute/Volume Icon */}
              <div className="absolute bottom-4 right-4">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center transition-colors"
                  aria-label="Mute/Unmute"
                >
                  <Volume2 className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Bottom Left Title text (subtle) */}
              <div className="absolute bottom-4 left-4 right-14 text-white">
                <p className="text-xs font-semibold drop-shadow-md truncate">{video.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows centered below */}
        <div className="flex items-center justify-center gap-6 mt-8 sm:mt-10">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 text-gray-800 hover:text-[#8B1812] transition-colors focus:outline-none"
            aria-label="Previous Review"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 text-gray-800 hover:text-[#8B1812] transition-colors focus:outline-none"
            aria-label="Next Review"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}

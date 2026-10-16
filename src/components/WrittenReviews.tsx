'use client';

import React from 'react';
import { Star } from 'lucide-react';

export default function WrittenReviews() {
  return (
    <section className="w-full bg-white py-14 sm:py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading matching Screenshot 2: Warm Red / Brick Red */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#99221a] text-center tracking-tight mb-12 sm:mb-16 font-montserrat">
          What People Think About Us
        </h2>

        {/* 2-Column Reviews Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 pb-12 border-b border-gray-200">
          
          {/* Review 1 */}
          <div className="flex flex-col justify-between">
            <div>
              {/* 5 JudgemeStar Stars */}
              <div className="flex items-center gap-1 text-[#f59e0b] mb-4">
                <span className="judgemestar text-[#f59e0b] text-lg select-none">
                  &#9733;&#9733;&#9733;&#9733;&#9733;
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
                &ldquo;The sales representative was very helpful in helping us choose the right product and was quick with the quote and delivery. They responded to all our emails and calls promptly and in a friendly, professional way. The products met our expectations right out of the box, and we&apos;re looking forward to getting them installed. Excellent customer service!&rdquo;
              </p>
            </div>

            {/* Author & Date */}
            <div className="mt-6 pt-2">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 font-montserrat">
                Charles S.
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Oct 26, 2025
              </p>
            </div>
          </div>

          {/* Review 2 */}
          <div className="flex flex-col justify-between">
            <div>
              {/* 5 JudgemeStar Stars */}
              <div className="flex items-center gap-1 text-[#f59e0b] mb-4">
                <span className="judgemestar text-[#f59e0b] text-lg select-none">
                  &#9733;&#9733;&#9733;&#9733;&#9733;
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
                &ldquo;The shipping was much faster than expected. The LED quality is excellent and works exactly as advertised.&rdquo;
              </p>
            </div>

            {/* Author & Date */}
            <div className="mt-6 pt-2">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 font-montserrat">
                Stephanie R.
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Dec 03, 2025
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

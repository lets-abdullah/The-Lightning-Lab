"use client";

import React, { useState } from "react";
import { StarRow } from "./star-row";
import { CheckCircle2, Star, X } from "lucide-react";
import { toast } from "sonner";

interface ProductReviewsProps {
  ratingAverage?: number;
  reviewCount?: number;
}

interface ReviewItem {
  id: string;
  author: string;
  title: string;
  comment: string;
  rating: number;
  date: string;
  verified: boolean;
  variant: string;
}

export function ProductReviews({
  ratingAverage = 4.9,
  reviewCount = 18,
}: ProductReviewsProps) {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([
    {
      id: "rev-1",
      author: "Marcus Vance",
      title: "Best commercial LED troffers on the market",
      comment:
        "We retrofitted 240 old T8 fluorescent troffers in a 3-story office building with these 2x4 fixtures. The tunable wattage and CCT made site commissioning effortless. Tenants love the crisp, flicker-free light and our utility company already approved the DLC rebate checks.",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
      variant: "40W / 4000K Cool White",
    },
    {
      id: "rev-2",
      author: "David L. (Apex Electrical)",
      title: "Contractor approved — fast 15-minute installation",
      comment:
        "The earthquake clips and terminal access plate are designed by people who actually install lights. Solid steel housing, zero flex, and the emergency driver knockout was right where we needed it. Ordered a 48-fixture pallet and they arrived in 2 business days.",
      rating: 5,
      date: "1 month ago",
      verified: true,
      variant: "50W / 5000K Daylight",
    },
    {
      id: "rev-3",
      author: "Sarah Jenkins",
      title: "Clean look and completely silent driver",
      comment:
        "Installed in our architecture studio. Absolutely no humming or buzzing when dimmed down to 10% on standard 0-10V dimmers. Very even light spread without any visible LED pixelation.",
      rating: 5,
      date: "2 months ago",
      verified: true,
      variant: "30W / 3500K Warm Neutral",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !title.trim() || !comment.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newReview: ReviewItem = {
        id: `rev-${Date.now()}`,
        author: author.trim(),
        title: title.trim(),
        comment: comment.trim(),
        rating,
        date: "Just now",
        verified: true,
        variant: "Verified Purchase",
      };

      setReviewsList([newReview, ...reviewsList]);
      setSubmitting(false);
      setIsOpen(false);
      setAuthor("");
      setTitle("");
      setComment("");
      setRating(5);
      toast.success("Thank you! Your review has been submitted.");
    }, 400);
  };

  const totalReviews = reviewCount + (reviewsList.length - 3);

  return (
    <section className="space-y-8 pt-8 border-t border-gray-200" aria-label="Customer Reviews">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950">
          Customer Reviews
        </h2>
        <p className="text-xs text-gray-500">
          Verified contractor and commercial facility manager ratings.
        </p>
      </div>

      {/* Rating Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-gray-50/60 border border-gray-200 rounded-xl items-center">
        {/* Left: Big Score */}
        <div className="text-center md:text-left space-y-2">
          <div className="text-4xl sm:text-5xl font-black text-gray-950">
            {ratingAverage.toFixed(1)}
          </div>
          <StarRow rating={ratingAverage} />
          <p className="text-xs text-gray-500">
            Based on {totalReviews} verified contractor reviews
          </p>
        </div>

        {/* Center: Rating Bars */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-12 text-gray-600 font-medium">5 Star</span>
            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: "92%" }} />
            </div>
            <span className="w-8 text-right text-gray-500 font-mono">92%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-gray-600 font-medium">4 Star</span>
            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: "8%" }} />
            </div>
            <span className="w-8 text-right text-gray-500 font-mono">8%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-gray-600 font-medium">3 Star</span>
            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: "0%" }} />
            </div>
            <span className="w-8 text-right text-gray-500 font-mono">0%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-gray-600 font-medium">2 Star</span>
            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: "0%" }} />
            </div>
            <span className="w-8 text-right text-gray-500 font-mono">0%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-gray-400 font-medium">1 Star</span>
            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: "0%" }} />
            </div>
            <span className="w-8 text-right text-gray-500 font-mono">0%</span>
          </div>
        </div>

        {/* Right: Write a Review Button */}
        <div className="text-center md:text-right">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="bg-black hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-lg text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Modal / Dialog for Write a Review */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 text-gray-900">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold tracking-tight text-gray-900">
                Write a Customer Review
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Share your experience with fellow contractors and facilities managers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Select */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`size-6 ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Your Name / Contractor Name *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. John Miller (Electrician)"
                  className="w-full text-xs sm:text-sm p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1812]"
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Easy install and high lumen output"
                  className="w-full text-xs sm:text-sm p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1812]"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Detailed Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe fixture build quality, light output, dimming response, or installation notes..."
                  className="w-full text-xs sm:text-sm p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1812]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#8B1812] hover:bg-[#72130e] text-white font-bold px-6 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Cards */}
      <div className="space-y-4">
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="border border-gray-200 rounded-xl p-6 bg-white space-y-3 shadow-2xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <StarRow rating={rev.rating} />
                <span className="text-sm font-bold text-gray-900">{rev.title}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">{rev.date}</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {rev.comment}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                <span>{rev.author}</span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="size-3" />
                    Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-gray-400 text-[11px] font-mono">{rev.variant}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { reviews } from "@/lib/data";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/animations/MotionWrappers";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} className={s <= rating ? "text-warning fill-warning" : "text-gray-200 fill-gray-100"} />
      ))}
    </span>
  );
}

export function Reviews() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(page * perPage, page * perPage + perPage);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) return alert("Please select a rating.");
    if (!reviewText.trim()) return alert("Please write a review.");
    
    // In a real app this would call an API. For now, simulate success.
    alert("Thank you! Your review has been submitted for approval.");
    setIsFormOpen(false);
    setNewRating(0);
    setReviewText("");
  };

  return (
    <section className="py-14 bg-white" id="reviews-section">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-black text-navy">Customer Reviews</h2>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-10 h-10 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                disabled={page === pages - 1}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {visible.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary text-white font-black rounded-full flex items-center justify-center text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Overall Rating & Leave Review Action */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-orange-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center gap-4">
            <p className="text-5xl font-black text-navy">3.4</p>
            <div>
              <StarRating rating={3.4} />
              <p className="text-sm text-gray-500 mt-1">(1,302 reviews total)</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              setTimeout(() => {
                document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full md:w-auto bg-primary text-white font-bold py-3 px-8 rounded-pill hover:bg-primary/90 transition shadow-md whitespace-nowrap"
          >
            {isFormOpen ? "Cancel Review" : "Leave a Review"}
          </button>
        </div>

        {/* Add Review Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 overflow-hidden"
              id="review-form"
            >
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-heading font-bold text-navy mb-4">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={`${
                              star <= (hoverRating || newRating)
                                ? "text-warning fill-warning"
                                : "text-gray-200 fill-gray-100"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="review" className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                    <textarea
                      id="review"
                      rows={4}
                      placeholder="What did you like or dislike? How was the food?"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 p-4 outline-none focus:border-primary transition resize-none font-medium"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full sm:w-auto bg-navy text-white font-bold py-3 px-8 rounded-pill hover:bg-navy/90 transition">
                    Submit Review
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';

interface Testimonial {
  name: string;
  company: string;
  image: string;
  quote: string;
  results: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const handlePrevious = () => {
    setAutoplay(false);
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setAutoplay(false);
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div className="relative h-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', duration: 0.5 }}
              className="w-full"
            >
              <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex-shrink-0">
                    <img 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-100"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-6">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{testimonials[currentIndex].name}</p>
                        <p className="text-gray-600">{testimonials[currentIndex].company}</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Results: {testimonials[currentIndex].results}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors duration-200"
          aria-label="Previous testimonial"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setAutoplay(false);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors duration-200"
          aria-label="Next testimonial"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
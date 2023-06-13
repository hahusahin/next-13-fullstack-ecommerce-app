"use client";

import React, { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

interface StarRatingProps {
  rating: number;
  onRatingSelected: (rating: number) => void;
}

const StarRating = ({ rating, onRatingSelected }: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            onClick={() => onRatingSelected(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            className="bg-transparent border-0 outline-0 cursor-pointer"
          >
            <span className="text-yellow-600">
              {index <= (hover || rating) ? (
                <BsStarFill size="1.5rem" />
              ) : (
                <BsStar size="1.5rem" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

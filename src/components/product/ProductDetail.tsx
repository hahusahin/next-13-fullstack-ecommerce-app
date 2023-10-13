"use client";

import { Product, Review, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import ReviewForm from "../review/ReviewForm";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import useCartStore from "@/hooks/useCartStore";

interface ProductProps {
  product: Product & {
    reviews: (Review & {
      user: User;
    })[];
  };
}

const ProductDetail = ({ product }: ProductProps) => {
  const { addToCart } = useCartStore();

  const [showReviewForm, setShowReviewForm] = useState<boolean | undefined>(
    undefined
  );

  const router = useRouter();

  const { data: session } = useSession();

  const closeForm = () => {
    setShowReviewForm(undefined);
    router.refresh();
  };

  const { reviews: _, ...productOnly } = product;

  return (
    <>
      <p className="text-4xl font-bold text-center mt-6 mb-8">
        Product Details
      </p>
      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="w-full max-h-[300px] relative flex-[2]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="flex flex-col flex-[5] gap-4">
          <p className="text-2xl font-semibold">{product.name}</p>
          <p className="text-yellow-700 text-xl">
            {product.rating > 0
              ? `User Rating: ${product.rating} / 5`
              : "User Rating: No Reviews Yet"}
          </p>
          <p className="text-blue-400 text-xl">{`$ ${product.price}`}</p>
          <ul className="flex flex-col gap-2 list-disc ps-4">
            {product.description.split("'*'").map((paragraph, i) => (
              <li key={i}>{paragraph}</li>
            ))}
          </ul>
          <Button
            variant="primary"
            className="mt-2 max-w-max"
            onClick={() =>
              addToCart({
                ...productOnly,
                createdAt: productOnly.createdAt.toISOString(),
              })
            }
          >
            ADD TO CART
          </Button>
        </div>
      </div>

      <p className="text-2xl font-bold text-center mt-8 mb-6">
        Product Reviews
      </p>
      {product.reviews.length > 0 ? (
        <div className="flex flex-col gap-4 w-full lg:w-[50rem]">
          {product.reviews.map((review) => (
            <div
              className="flex flex-col p-4 gap-2 border-2 border-blue-900 rounded-xl"
              key={review.id}
            >
              <div className="text-yellow-600 text-2xl">
                {[...Array(5)].map((_, index) =>
                  index < review.rating ? (
                    <span key={index}>&#9733;</span>
                  ) : (
                    <span key={index}>&#9734;</span>
                  )
                )}
              </div>
              <p className="">{review.review}</p>
              <p className="text-end italic">{review.user.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-center">No Reviews Yet</p>
      )}
      <div className="flex justify-center my-6">
        {showReviewForm === undefined && (
          <Button
            variant="success"
            className="mt-4 max-w-max"
            onClick={() => setShowReviewForm(session ? true : false)}
          >
            REVIEW PRODUCT
          </Button>
        )}

        {showReviewForm === true && (
          <ReviewForm productId={product.id} closeForm={closeForm} />
        )}
        {showReviewForm === false && (
          <div className="flex flex-col items-center gap-4">
            <p>You should be logged in to make review</p>
            <Button
              variant="destructive"
              className="mt-4 max-w-max"
              onClick={() =>
                router.push(`/login?callbackUrl=/product/${product.id}`)
              }
            >
              LOGIN
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;

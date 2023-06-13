"use client";

import { toast } from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import StarRating from "./StarRating";
import { useState } from "react";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Spinner from "../Spinner";

const registerSchema = yup
  .object({
    rating: yup.number().required("Rating is a must"),
    review: yup.string(),
  })
  .required();

interface FormValues {
  rating: number;
  review: string;
}

interface ReviewFormProps {
  productId: string;
  closeForm: () => void;
}

const ReviewForm = ({ productId, closeForm }: ReviewFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    axios
      .post(`/api/product/${productId}`, data)
      .then(() => {
        toast.success("Review Added Successfully!");
      })
      .catch((res) => {
        toast.error(res?.response?.data?.error || "Something went wrong!");
      })
      .finally(() => {
        closeForm();
        setIsLoading(false);
      });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control space-y-1">
        <label className="label">
          <span className="text-base font-medium label-text">Rating</span>
        </label>
        <Controller
          control={control}
          name="rating"
          render={({ field: { onChange } }) => (
            <StarRating
              rating={watch("rating")}
              onRatingSelected={(rating) => onChange(rating)}
            />
          )}
        />
        {errors.rating && (
          <label className="label label-text text-red-400">
            {errors.rating.message}
          </label>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="text-base font-medium label-text">Review</span>
        </label>
        <textarea
          {...register("review")}
          placeholder="Your Review"
          className="textarea textarea-bordered min-w-[400px] h-28"
        ></textarea>
      </div>
      <div className="flex justify-center">
        <button className="btn btn-outline btn-secondary my-4" type="submit">
          {isLoading && <Spinner />}
          Add Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;

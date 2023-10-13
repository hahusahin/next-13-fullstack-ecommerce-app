"use client";

import { Controller, useForm } from "react-hook-form";
import StarRating from "./StarRating";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const registerSchema = yup
  .object({
    rating: yup.number().required("Rating is a must"),
    review: yup.string(),
  })
  .required();

interface FormValues {
  rating: number;
  review?: string;
}

interface ReviewFormProps {
  productId: string;
  closeForm: () => void;
}

const ReviewForm = ({ productId, closeForm }: ReviewFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate: createReview, isLoading } = useMutation({
    mutationFn: async (data: FormValues) =>
      await axios.post(`/api/product/${productId}`, data),
    onSuccess: () => {
      toast({
        title: "Review Added Successfully!",
      });
      closeForm();
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createReview(data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3">
        <Label>
          <span>Rating</span>
          <span className="text-red-400">&#65121;</span>
        </Label>
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
          <span className="text-sm text-red-400">{errors.rating.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Review</Label>
        <Textarea
          className="min-w-[400px] h-28"
          placeholder="Your Review"
          {...register("review")}
        />
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline-primary"
          className="my-4"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          ADD REVIEW
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;

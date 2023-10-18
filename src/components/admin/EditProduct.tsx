"use client";

import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useToast } from "../ui/use-toast";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import { IoArrowBackOutline, IoImageOutline } from "react-icons/io5";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const productSchema = yup.object({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description name is required"),
  imageUrl: yup.string().required("Image is required"),
  price: yup.number().required("Price is required"),
  countInStock: yup.number().required("Price is required"),
  category: yup.string().required("Image is required"),
  brand: yup.string().required("Image is required"),
});

type FormData = yup.InferType<typeof productSchema>;

const EditProduct = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price,
      countInStock: product.countInStock,
      category: product.category,
      brand: product.brand,
    },
  });

  const { mutate: updateProduct, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: async (data: FormData) =>
      await axios.put(`/api/admin/product/${product.id}`, data),
    onSuccess: () => {
      toast({ title: "Product Updated Successfully!" });
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    updateProduct(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 items-center w-full max-w-[40rem] mx-auto my-8 p-8 border-2 border-gray-300 rounded-xl shadow-md"
    >
      <Link href="/admin/products" className="flex gap-2 items-center mr-auto">
        <IoArrowBackOutline />
        All Products
      </Link>
      <p className="text-2xl font-bold">Edit Product</p>
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-left ml-2">
          <span>Name</span>
          <span className="text-red-400">&#65121;</span>
        </Label>
        <Input {...register("name")} />
        {errors.name && (
          <span className="text-sm text-red-400">{errors.name.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-left ml-2">
          <span>Description</span>
          <span className="text-red-400">&#65121;</span>
        </Label>
        <Textarea className="h-32" {...register("description")} />
        {errors.description && (
          <span className="text-sm text-red-400">
            {errors.description.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-left ml-2">
          <span>Image</span>
          <span className="text-red-400">&#65121;</span>
        </Label>
        <Controller
          control={control}
          name="imageUrl"
          render={({ field: { value, onChange } }) => (
            <div className="flex flex-col md:flex-row gap-2">
              {value && (
                <div className="w-48 h-32 relative">
                  <Image
                    fill
                    src={value}
                    alt="Product Image"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}
              <CldUploadWidget
                onUpload={(result: any) => {
                  onChange(result.info?.secure_url);
                }}
                uploadPreset="geqaiopj"
                options={{ maxFiles: 1 }}
              >
                {({ open }) => {
                  return (
                    <div
                      className="relative
                cursor-pointer
                hover:opacity-70
                transition
                border-dashed 
                border-2 
                p-4 
                border-neutral-300
                flex
                flex-col
                justify-center
                items-center
                gap-4
                text-neutral-600
                w-48 h-32"
                      onClick={() => open?.()}
                    >
                      <IoImageOutline />
                      <span>Click to upload</span>
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>
          )}
        />
        {errors.imageUrl && (
          <span className="text-sm text-red-400">
            {errors.imageUrl.message}
          </span>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div className="flex flex-col gap-2 flex-1">
          <Label className="text-left ml-2">
            <span>Category</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("category")} />
          {errors.category && (
            <span className="text-sm text-red-400">
              {errors.category.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Label className="text-left ml-2">
            <span>Brand</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("brand")} />
          {errors.brand && (
            <span className="text-sm text-red-400">{errors.brand.message}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div className="flex flex-col gap-2 flex-1">
          <Label className="text-left ml-2">
            <span>Price</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("price")} type="number" min="0" step="any" />
          {errors.price && (
            <span className="text-sm text-red-400">{errors.price.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Label className="text-left ml-2">
            <span>Count In Stock</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("countInStock")} type="number" />
          {errors.countInStock && (
            <span className="text-sm text-red-400">
              {errors.countInStock.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-4 mx-auto">
        <Button variant="destructive" type="button" onClick={() => reset()}>
          Reset
        </Button>
        <Button variant="success" type="submit" disabled={isLoadingUpdate}>
          {isLoadingUpdate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditProduct;

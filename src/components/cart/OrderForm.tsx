"use client";

import { useAppSelector } from "@/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";

const registerSchema = yup
  .object({
    address: yup.string().required("Address is a must"),
    city: yup.string().required("City is a must"),
    zipCode: yup.string().required("Postal Code is a must"),
    country: yup.string().required("Country is a must"),
  })
  .required();

type OrderFormData = yup.InferType<typeof registerSchema>;

const OrderForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const user = session && (session.user as User);

  const cartItems = useAppSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data: OrderFormData) => {
    setIsLoading(true);
    axios
      .post(`/api/order`, {
        cartItems,
        totalPrice,
      })
      .then(() => {
        toast.success("We Took Your Order Successfully!");
      })
      .catch((res) => {
        toast.error(res?.response?.data?.error || "Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
        router.push("/profile");
      });
  };

  return (
    <form
      className="text-center mx-auto w-full max-w-[40rem] flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="form-control w-full max-w-md">
        <label className="label label-text justify-start">
          <span>Address</span>
          <span className="text-red-400">&#65121;</span>
        </label>
        <textarea
          {...register("address")}
          className="textarea textarea-bordered min-w-[400px] h-20"
          defaultValue={user?.address ? user.address : ""}
        ></textarea>
        {errors.address && (
          <label className="label label-text text-red-400">
            {errors.address.message}
          </label>
        )}
      </div>
      <div className="form-control w-full max-w-md">
        <label className="label label-text justify-start">
          <span>City</span>
          <span className="text-red-400">&#65121;</span>
        </label>
        <input
          {...register("city")}
          type="text"
          className="input input-bordered input-sm"
          defaultValue={user?.city ? user.city : ""}
        />
        {errors.city && (
          <label className="label label-text text-red-400">
            {errors.city.message}
          </label>
        )}
      </div>
      <div className="form-control w-full max-w-md">
        <label className="label label-text justify-start">
          <span>Postal Code</span>
          <span className="text-red-400">&#65121;</span>
        </label>
        <input
          {...register("zipCode")}
          type="text"
          className="input input-bordered input-sm"
          defaultValue={user?.zipcode ? user.zipcode : ""}
        />
        {errors.zipCode && (
          <label className="label label-text text-red-400">
            {errors.zipCode.message}
          </label>
        )}
      </div>
      <div className="form-control w-full max-w-md">
        <label className="label label-text justify-start">
          <span>Country</span>
          <span className="text-red-400">&#65121;</span>
        </label>
        <input
          {...register("country")}
          type="text"
          className="input input-bordered input-sm"
          defaultValue={user?.country? user.country : ""}
        />
        {errors.country && (
          <label className="label label-text text-red-400">
            {errors.country.message}
          </label>
        )}
      </div>
      
      <button className="btn btn-primary mt-6 max-w-max" type="submit">
        {isLoading && <Spinner />}
        Continue
      </button>
    </form>
  );
};

export default OrderForm;

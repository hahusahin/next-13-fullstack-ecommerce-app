"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import Spinner from "@/components/Spinner";
import { toast } from "react-hot-toast";

const loginSchema = yup
  .object({
    email: yup.string().email().required("Email is a must"),
    password: yup
      .string()
      .min(6, "Password must have at least 6 characters")
      .required("Please enter a password"),
  })
  .required();

type FormData = yup.InferType<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.ok) {
        toast.success("Logged In Successfully!");
        router.back();
        router.refresh();
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container my-8">
      <div className="flex flex-col gap-4 items-center mx-auto max-w-[25rem] p-8 border-2 border-blue-300 rounded-xl">
        <p className="text-2xl font-bold">Login</p>
        <div className="form-control w-full">
          <label className="label">
            <span className="text-base font-medium label-text">Your Email</span>
          </label>
          <input
            className="input input-bordered border-blue-200 w-full"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <label className="label label-text text-red-400">
              {errors.email.message}
            </label>
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="text-base font-medium label-text">
              Your Password
            </span>
          </label>
          <input
            className="input input-bordered border-blue-200 w-full"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <label className="label label-text text-red-400">
              {errors.password.message}
            </label>
          )}
        </div>
        <button className="btn btn-info mt-2 max-w-max" type="submit">
          {isLoading && <span className="loading loading-spinner"></span>}
          Login
        </button>
        <div className="divider my-0" />

        <button
          className="btn btn-outline w-full"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <FcGoogle className="mr-2" />
          Continue With Google
        </button>
        <Link
          href="/register"
          className="link link-hover text-gray-700 font-medium mt-4"
        >
          Create New Account
        </Link>
      </div>
    </form>
  );
};

export default Login;

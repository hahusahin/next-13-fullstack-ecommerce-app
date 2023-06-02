"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

const registerSchema = yup
  .object({
    name: yup.string().required("Name is a must"),
    email: yup.string().email().required("Email is a must"),
    password: yup
      .string()
      .min(6, "Password must have at least 6 characters")
      .required("Please enter a password"),
    city: yup.string(),
    zipcode: yup.string(),
    address: yup.string(),
  })
  .required();

type FormData = yup.InferType<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    axios
      .post("/api/register", data)
      .then(() => {
        toast({
          title: "Account created.",
          description: "Registered Successfully!",
          status: "success",
        });
        router.push("/");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error,
          status: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) return <Spinner />;

  return (
    <form
      className="text-center mx-auto w-full max-w-[40rem]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="my-4 text-2xl font-bold text-sky-600">Sign Up</p>
      <div className="flex flex-col gap-4">
        <div className="form-control w-full">
          <label className="label label-text justify-start">
            <span>Name</span>
            <span className="text-red-400">&#65121;</span>
          </label>
          <input
            type="text"
            className="input input-bordered input-sm"
            {...register("name")}
          />
          {errors.name && (
            <label className="label label-text text-red-400">
              {errors.name.message}
            </label>
          )}
        </div>
        <div className="flex gap-4">
          <div className="form-control w-full">
            <label className="label label-text justify-start">
              <span>Email</span>
              <span className="text-red-400">&#65121;</span>
            </label>
            <input
              type="email"
              className="input input-bordered input-sm"
              {...register("email")}
            />
            {errors.email && (
              <label className="label label-text text-red-400">
                {errors.email.message}
              </label>
            )}
          </div>
          <div className="form-control w-full">
            <label className="label label-text justify-start">
              <span>Password</span>
              <span className="text-red-400">&#65121;</span>
            </label>
            <input
              type="password"
              className="input input-bordered input-sm w-full"
              {...register("password")}
            />
            {errors.password && (
              <label className="label label-text text-red-400">
                {errors.password.message}
              </label>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="form-control w-full">
            <label className="label label-text justify-start">
              <span>City</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm"
              {...register("city")}
            />
          </div>
          <div className="form-control w-full">
            <label className="label label-text justify-start">
              <span>Zip Code</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              {...register("zipcode")}
            />
          </div>
        </div>
        <div className="form-control w-full">
          <label className="label label-text justify-start">
            <span>Address</span>
          </label>
          <input
            type="text"
            className="input input-bordered input-sm w-full"
            {...register("address")}
          />
        </div>
      </div>
      <button className="btn btn-primary mt-6" type="submit">
        Create Account
      </button>
    </form>
  );
};

export default Register;

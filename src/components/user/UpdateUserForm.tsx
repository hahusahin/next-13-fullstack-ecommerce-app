"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { ProfileProps } from "./Profile";

const registerSchema = yup
  .object({
    name: yup.string().required("Name is a must"),
    email: yup.string().email().required("Email is a must"),
    password: yup
      .string()
      .min(6, "Password must have at least 6 characters")
      .required("Please enter a password"),
    confirmPassword: yup
      .string()
      .min(6, "Password must have at least 6 characters")
      .required("Please enter a password"),
  })
  .required();

type FormData = yup.InferType<typeof registerSchema>;

const UpdateUserForm = ({ user }: ProfileProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: user.name!,
      email: user.email!,
    },
  });

  const onSubmit = async (data: FormData) => {};

  return (
    <div className="flex flex-col gap-2">
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
          autoComplete="new-password"
          className="input input-bordered input-sm w-full"
          {...register("password")}
        />
        {errors.password && (
          <label className="label label-text text-red-400">
            {errors.password.message}
          </label>
        )}
      </div>
      <div className="form-control w-full">
        <label className="label label-text justify-start">
          <span>Confirm Password</span>
          <span className="text-red-400">&#65121;</span>
        </label>
        <input
          type="password"
          autoComplete="new-password"
          className="input input-bordered input-sm w-full"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <label className="label label-text text-red-400">
            {errors.confirmPassword.message}
          </label>
        )}
      </div>
      <button className="btn btn-primary mt-4 w-fit" type="submit">
        Update Account
      </button>
    </div>
  );
};

export default UpdateUserForm;

"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { ProfileProps } from "./Account";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
      .test("passwords-match", "Passwords must match", function (value) {
        return this.parent.password === value;
      }),
    country: yup.string(),
    city: yup.string(),
  })
  .required();

type FormData = yup.InferType<typeof registerSchema>;

const UpdateUserModal = ({ user }: ProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      country: user.country ?? "",
      city: user.city ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    axios
      .put(`/api/account/`, data)
      .then(() => {
        // toast.success("Profile Updated Successfully!");
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(err?.response?.data?.error || "Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false)
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Label className="w-1/4" htmlFor="name">
                  <span>Name</span>
                  <span className="text-red-400">&#65121;</span>
                </Label>
                <Input className="w-3/4" {...register("name")} />
              </div>
              {errors.name && (
                <span className="text-sm text-red-400">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Label className="w-1/4" htmlFor="email">
                  <span>Email</span>
                  <span className="text-red-400">&#65121;</span>
                </Label>
                <Input className="w-3/4" {...register("email")} />
              </div>
              {errors.email && (
                <span className="text-sm text-red-400">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Label className="w-1/4" htmlFor="password">
                  <span>Password</span>
                  <span className="text-red-400">&#65121;</span>
                </Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  className="w-3/4"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <span className="text-sm text-red-400">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Label className="w-1/4" htmlFor="password">
                  <span>Confirm Password</span>
                  <span className="text-red-400">&#65121;</span>
                </Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  className="w-3/4"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-sm text-red-400">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Label className="w-1/4" htmlFor="country">
                  <span>Country</span>
                </Label>
                <Input className="w-3/4" {...register("country")} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Label className="w-1/4" htmlFor="city">
                  <span>City</span>
                </Label>
                <Input className="w-3/4" {...register("city")} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;

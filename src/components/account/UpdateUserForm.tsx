import React, { useState } from "react";
import { ProfileProps } from "./Account";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";

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

const UpdateUserForm = ({ user }: ProfileProps) => {
  const router = useRouter();
  const { toast } = useToast();

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

  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: async (data: FormData) => await axios.put("/api/account", data),
    onSuccess: () => {
      toast({ title: "Profile Updated Successfully!" });
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
    updateUser(data);
  };

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="p-4">
          <p className="text-2xl font-bold">My Profile</p>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter>
          <Button variant="success" className="mx-auto" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UpdateUserForm;

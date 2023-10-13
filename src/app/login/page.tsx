"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

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
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const { mutate: loginUser, isLoading } = useMutation({
    mutationFn: async (data: FormData) =>
      signIn("credentials", {
        ...data,
        redirect: false,
      }).then((callback) => {
        if (callback?.error) {
          toast({
            variant: "destructive",
            title: callback.error,
          });
        } else {
          const callbackUrl = searchParams.get("callbackUrl");
          router.push(callbackUrl ? callbackUrl : "/");
          router.refresh();
          toast({
            title: "Logged In Successfully",
          });
        }
      }),
  });

  const onSubmit = (data: FormData) => loginUser(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container my-8">
      <div className="flex flex-col gap-6 items-center mx-auto max-w-[25rem] p-8 border-2 border-gray-300 rounded-xl shadow-md">
        <p className="text-2xl font-bold">Login</p>
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-left ml-2">
            <span>Your Email</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("email")} />
          {errors.email && (
            <span className="text-sm text-red-400">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-left ml-2">
            <span>Your Password</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input type="password" {...register("password")} />
          {errors.password && (
            <span className="text-sm text-red-400">
              {errors.password.message}
            </span>
          )}
        </div>
        <Button
          variant="primary"
          type="submit"
          className="mx-auto"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
        <Separator className="my-0" />
        <Button
          className="w-full"
          variant="outline"
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <FcGoogle className="mr-2" />
          Continue With Google
        </Button>
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

"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const registerSchema = yup
  .object({
    name: yup.string().required("Name is a must"),
    email: yup.string().email().required("Email is a must"),
    password: yup
      .string()
      .min(6, "Password must have at least 6 characters")
      .required("Please enter a password"),
    country: yup.string(),
    city: yup.string(),
  })
  .required();

type FormData = yup.InferType<typeof registerSchema>;

const Register = () => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate: createUser, isLoading } = useMutation({
    mutationFn: (data: FormData) => axios.post("/api/register", data),
    onSuccess: () => {
      toast({
        title: "Created Account Successfully!",
      });
      signIn("credentials", {
        email: getValues("email"),
        password: getValues("password"),
        redirect: false,
      }).then((callback) => {
        if (callback?.ok) {
          router.push("/");
          router.refresh();
          toast({
            title: "Logged In Successfully",
          });
        }
        if (callback?.error) {
          toast({
            variant: "destructive",
            title: callback.error,
          });
        }
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    createUser(data);
  };

  const { data: session } = useSession();

  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);

  return (
    <form
      className="text-center mx-auto w-full max-w-[40rem] p-8 border-2 border-gray-300 rounded-xl shadow-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="mb-4 text-2xl font-bold">Sign Up</p>
      <p className="my-4 text-xs">
        (You can register with dummy email to see protected pages)
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-left ml-2">
            <span>Name</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("name")} />
          {errors.name && (
            <span className="text-sm text-red-400">{errors.name.message}</span>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <Label className="text-left ml-2">
              <span>Email</span>
              <span className="text-red-400">&#65121;</span>
            </Label>
            <Input {...register("email")} />
            {errors.email && (
              <span className="text-sm text-red-400">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label className="text-left ml-2">
              <span>Password</span>
              <span className="text-red-400">&#65121;</span>
            </Label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <span className="text-sm text-red-400">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <Label className="text-left ml-2">
              <span>Country</span>
            </Label>
            <Input {...register("country")} />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label className="text-left ml-2">
              <span>City</span>
            </Label>
            <Input {...register("city")} />
          </div>
        </div>
      </div>
      <Button type="submit" className="mx-auto mt-6" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
};

export default Register;

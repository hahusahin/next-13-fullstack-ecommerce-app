"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ShippingAddress } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import axios from "axios";
import useCartStore from "@/hooks/useCartStore";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { IoAddOutline } from "react-icons/io5";

const registerSchema = yup.object({
  id: yup.string(),
  name: yup.string().required("City is a must"),
  address: yup.string().required("Address is a must"),
  city: yup.string().required("City is a must"),
  zipcode: yup.string().required("Postal Code is a must"),
  country: yup.string().required("Country is a must"),
});

type ShippingFormData = yup.InferType<typeof registerSchema>;

const Shipping = ({ addresses }: { addresses: ShippingAddress[] }) => {
  const router = useRouter();
  const { toast } = useToast();

  const { addAddressToCart } = useCartStore();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate: saveAddress, isLoading } = useMutation({
    mutationFn: async () => await axios.post("/api/shipping", getValues()),
    onSuccess: (res) => {
      addAddressToCart(res.data);
      toast({ title: "Address Saved Successfully!" });
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

  const onSubmit = (data: ShippingFormData) => {
    addAddressToCart({ ...data, id: data.id ? data.id : "" });
    router.push("/ordersummary");
  };

  return (
    <div className="container mb-auto mt-6">
      <p className="text-3xl text-center font-bold mb-6">
        Select Shipping Address
      </p>
      <form
        className="mx-auto w-full max-w-[40rem] flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-4">
          {addresses.map((address) => (
            <Button
              variant="outline-dark"
              key={address.id}
              onClick={() =>
                reset({
                  id: address.id,
                  name: address.name,
                  address: address.address,
                  zipcode: address.zipcode,
                  city: address.city,
                  country: address.country,
                })
              }
              type="button"
            >
              {address.name}
            </Button>
          ))}
          <Button
              type="button"
              variant="outline-dark"
              size="icon"
              onClick={() => {
                reset({
                  id: "",
                  name: "",
                  address: "",
                  zipcode: "",
                  city: "",
                  country: "",
                });
              }}
            >
              <IoAddOutline size="20" />
            </Button>
        </div>
        <div className="w-full max-w-md flex flex-col gap-2">
          <Label className="ml-2">
            <span>Label</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("name")} />
          {errors.name && (
            <span className="text-sm text-red-400">{errors.name.message}</span>
          )}
        </div>
        <div className="w-full max-w-md flex flex-col gap-2">
          <Label className="ml-2">
            <span>Address</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Textarea className="min-w-[400px] h-20" {...register("address")} />
          {errors.address && (
            <span className="text-sm text-red-400">
              {errors.address.message}
            </span>
          )}
        </div>
        <div className="w-full max-w-md flex flex-col gap-2">
          <Label className="ml-2">
            <span>City</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("city")} />
          {errors.city && (
            <span className="text-sm text-red-400">{errors.city.message}</span>
          )}
        </div>
        <div className="w-full max-w-md flex flex-col gap-2">
          <Label className="ml-2">
            <span>Postal Code</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("zipcode")} />
          {errors.zipcode && (
            <span className="text-sm text-red-400">
              {errors.zipcode.message}
            </span>
          )}
        </div>
        <div className="w-full max-w-md flex flex-col gap-2">
          <Label className="ml-2">
            <span>Country</span>
            <span className="text-red-400">&#65121;</span>
          </Label>
          <Input {...register("country")} />
          {errors.country && (
            <span className="text-sm text-red-400">
              {errors.country.message}
            </span>
          )}
        </div>
        <div className="flex gap-4 my-6">
          <Button
            variant="warning"
            className="max-w-max"
            onClick={() => saveAddress()}
            type="button"
            disabled={!isValid || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Address
          </Button>
          <Button variant="primary" className="max-w-max" type="submit">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Shipping;

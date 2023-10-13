import React, { useState } from "react";
import { ProfileProps } from "./Account";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const registerSchema = yup.object({
  id: yup.string(),
  name: yup.string().required("Name is a must"),
  address: yup.string().required("Address is a must"),
  city: yup.string().required("City is a must"),
  zipcode: yup.string().required("Postal Code is a must"),
  country: yup.string().required("Country is a must"),
});

type ShippingFormData = yup.InferType<typeof registerSchema>;

const UpdateAddressForm = ({ user }: ProfileProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate: updateAddress, isLoading } = useMutation({
    mutationFn: async (data: ShippingFormData) =>
      await axios.post("/api/shipping", data),
    onSuccess: () => {
      setShowForm(false);
      toast({
        title: "Profile Updated Successfully!",
      });
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
    updateAddress(data);
  };

  return (
    <Card className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="p-4">
          <p className="text-2xl font-bold mb-6">My Addresses</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {user.addresses.map((address) => (
              <Button
                key={address.id}
                type="button"
                variant="outline-dark"
                onClick={() => {
                  setShowForm(true);
                  reset({
                    id: address.id,
                    name: address.name,
                    address: address.address,
                    zipcode: address.zipcode,
                    city: address.city,
                    country: address.country,
                  });
                }}
              >
                {address.name}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline-dark"
              size="icon"
              onClick={() => {
                setShowForm(true);
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
          {showForm && (
            <div className="max-w-[40rem] flex flex-col gap-4">
              <div className="w-full max-w-md flex flex-col gap-2">
                <Label className="ml-2">
                  <span>Label</span>
                  <span className="text-red-400">&#65121;</span>
                </Label>
                <Input {...register("name")} type="text" />
                {errors.name && (
                  <span className="text-sm text-red-400">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="w-full max-w-md flex flex-col gap-2">
                <Label className="ml-2">
                  <span>Address</span>
                  <span className="text-red-400">&#65121;</span>
                </Label>
                <Textarea
                  className="min-w-[400px] h-20"
                  {...register("address")}
                />
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
                  <span className="text-sm text-red-400">
                    {errors.city.message}
                  </span>
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
            </div>
          )}
        </CardContent>
        <CardFooter>
          {showForm && (
            <Button variant="success" type="submit" className="mx-auto" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default UpdateAddressForm;

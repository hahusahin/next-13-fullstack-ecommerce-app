import React, { useState } from "react";
import { ProfileProps } from "./Account";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { IoAddOutline } from "react-icons/io5";
import useQuery from "@/hooks/useQuery";
import { useRouter } from "next/navigation";

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
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate, isLoading } = useQuery<ShippingFormData>();

  const callbackFn = () => {
    setShowForm(false);
    reset();
    router.refresh();
  };

  const onSubmit = (data: ShippingFormData) => {
    mutate(
      { url: "/api/shipping", method: "POST", data },
      {
        onSuccess: () => {
          toast.success("Address Saved Successfully!");
          callbackFn();
        },
        onError: (error) => {
          toast.error(error.message);
          setShowForm(false);
          callbackFn();
        },
      }
    );
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
                variant="outline"
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
              variant="outline"
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
            <div className="max-w-[40rem] flex flex-col">
              <div className="form-control w-full max-w-md">
                <label className="label label-text justify-start">
                  <span>Label</span>
                  <span className="text-red-400">&#65121;</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className="input input-bordered input-sm"
                />
                {errors.name && (
                  <label className="label label-text text-red-400">
                    {errors.name.message}
                  </label>
                )}
              </div>
              <div className="form-control w-full max-w-md">
                <label className="label label-text justify-start">
                  <span>Address</span>
                  <span className="text-red-400">&#65121;</span>
                </label>
                <textarea
                  {...register("address")}
                  className="textarea textarea-bordered min-w-[400px] h-20"
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
                  {...register("zipcode")}
                  type="text"
                  className="input input-bordered input-sm"
                />
                {errors.zipcode && (
                  <label className="label label-text text-red-400">
                    {errors.zipcode.message}
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
                />
                {errors.country && (
                  <label className="label label-text text-red-400">
                    {errors.country.message}
                  </label>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {showForm && (
            <Button type="submit" className="mx-auto" disabled={isLoading}>
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

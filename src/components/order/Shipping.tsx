"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ShippingAddress } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "react-hot-toast";
import useCartStore from "@/hooks/useCartStore";

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

  const onSubmit = (data: ShippingFormData) => {
    addAddressToCart({ ...data, id: data.id ? data.id : "" });
    router.push("/ordersummary");
  };

  const saveAddressHandler = () => {
    axios
      .post("/api/shipping", getValues())
      .then((res) => {
        addAddressToCart(res.data);
        toast.success("Address Saved Successfully!");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="container mb-auto mt-6">
      <p className="text-3xl text-center font-bold mb-6">
        Select Shipping Address
      </p>
      <form
        className="text-center mx-auto w-full max-w-[40rem] flex flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control w-full max-w-md">
          <div className="join">
            {addresses.map((address) => (
              <button
                key={address.id}
                className="btn btn-outline btn-sm join-item mx-2"
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
              </button>
            ))}
          </div>
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
        <div className="flex gap-4">
          <button className="btn btn-primary mt-6 max-w-max" type="submit">
            Continue
          </button>
          <button
            className="btn btn-warning mt-6 max-w-max"
            onClick={saveAddressHandler}
            type="button"
            disabled={!isValid}
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default Shipping;

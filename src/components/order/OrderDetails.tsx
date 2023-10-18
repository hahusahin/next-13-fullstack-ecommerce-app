"use client";

import {
  Order,
  OrderItem,
  Product,
  ShippingAddress,
  User,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  IoCheckmarkDoneOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import moment from "moment";

interface OrderProps {
  order: Order & {
    shippingAddress: ShippingAddress;
    user: User;
    orderItems: (OrderItem & {
      product: Product;
    })[];
  };
}

const OrderDetails = ({ order }: OrderProps) => {
  const {
    id,
    createdAt,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    user,
    isDelivered,
    deliveredAt,
  } = order;

  const router = useRouter();
  const { toast } = useToast();

  const { data: session } = useSession();
  const loggedInUser = session && session.user;

  const { mutate: updateOrder, isLoading } = useMutation({
    mutationFn: async (data: { isDelivered: boolean; deliveredAt: Date }) =>
      await axios.put(`/api/order/${id}`, data),
    onSuccess: () => {
      toast({ title: "Order Updated Successfully!" });
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

  return (
    <div className="container mb-auto mt-6">
      <p className="text-3xl font-semibold mb-6">{`Order: ${id}`}</p>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="lg:w-2/3">
          <p className="text-2xl font-semibold mb-6">Shipping</p>
          {shippingAddress && (
            <>
              <p className="mb-4">
                <span className="font-semibold">Name: </span>
                {user.name}
              </p>
              <p className="mb-4">
                <span className="font-semibold">Email: </span>
                {user.email}
              </p>
              <p className="mb-4">
                <span className="font-semibold">Address: </span>
                {`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zipcode}, ${shippingAddress.country}`}
              </p>
              <div className="flex items-center gap-4">
                {isDelivered && deliveredAt ? (
                  <div className="flex items-center gap-2 p-3 bg-emerald-400 rounded-xl border w-fit">
                    <IoCheckmarkDoneOutline size={20} />
                    <span>Delivered At: {deliveredAt.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 p-3 bg-amber-400 rounded-xl border w-fit font-medium">
                      <IoInformationCircleOutline size={20} />
                      <span>Not Delivered!</span>
                    </div>
                    {loggedInUser?.role === "ADMIN" && (
                      <Button
                        type="button"
                        variant="success"
                        onClick={() =>
                          updateOrder({
                            isDelivered: true,
                            deliveredAt: new Date(),
                          })
                        }
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Mark As Delivered
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          <Separator className="my-4 h-[2px]" />
          <p className="text-2xl font-semibold mb-6">Payment</p>
          <p className="mb-4">
            <span className="font-semibold">Method: </span>
            Stripe
          </p>
          <div className="flex items-center gap-2 p-3 bg-emerald-400 rounded-xl border w-fit">
            <IoCheckmarkDoneOutline size={20} />
            <span>Paid On: {createdAt.toLocaleString()}</span>
          </div>
          <Separator className="my-4 h-[2px]" />
          <p className="text-2xl font-semibold mb-6">Order Items</p>
          {orderItems &&
            orderItems.map((item, i) => (
              <div className="flex gap-6 items-center mb-6" key={item.id}>
                <div className="w-8 h-8 relative">
                  <Image
                    fill
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <Link
                  href={`/product/${item.product.id}`}
                  className="link link-hover text-gray-700 font-medium"
                >
                  {item.product.name}
                </Link>
                <span>{`${item.quantity} x $${item.product.price} = $${
                  item.quantity * item.product.price
                }`}</span>
              </div>
            ))}
        </div>
        <Card className="lg:w-1/3 bg-slate-100 shadow-lg h-fit">
          <CardHeader>
            <CardTitle className="text-center mb-4">Price Details</CardTitle>
            <Separator className="h-[2px]" />
          </CardHeader>
          <CardContent>
            <div className="flex w-full">
              <span className="flex-1">Items</span>
              <span className="flex-1">{`$${itemsPrice}`}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex w-full">
              <span className="flex-1">Shipping</span>
              <span className="flex-1">{`$${shippingPrice}`}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex w-full">
              <span className="flex-1">Tax</span>
              <span className="flex-1">{`$${taxPrice}`}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex w-full">
              <span className="flex-1">Total</span>
              <span className="flex-1">{`$${totalPrice}`}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;

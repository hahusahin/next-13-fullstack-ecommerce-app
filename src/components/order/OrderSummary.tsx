"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import useCartStore from "@/hooks/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import getStripe from "@/utils/get-stripe";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const OrderSummmary = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();

  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const cartItems = useFromStore(useCartStore, (state) => state.cartItems);
  const itemsPrice = useFromStore(useCartStore, (state) => state.itemsPrice);
  const shippingPrice = useFromStore(
    useCartStore,
    (state) => state.shippingPrice
  );
  const taxPrice = useFromStore(useCartStore, (state) => state.taxPrice);
  const totalPrice = useFromStore(useCartStore, (state) => state.totalPrice);
  const shippingAddress = useFromStore(
    useCartStore,
    (state) => state.shippingAddress
  );
  const { clearCart } = useCartStore();

  const payOrder = async () => {
    try {
      const stripe = await getStripe();
      if (!stripe) return;

      const response = await axios({
        method: "POST",
        url: "/api/stripe",
        data: { cartItems, itemsPrice },
      });

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      error.message &&
        toast({
          variant: "destructive",
          title: error.message,
        });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.message,
      });
    }
  };

  const createNewOrder = async () => {
    if (!cartItems || !shippingAddress) return;

    try {
      setIsProcessingOrder(true);
      const data = {
        itemsPrice: parseFloat(itemsPrice ?? "0"),
        shippingPrice: parseFloat(shippingPrice ?? "0"),
        taxPrice: parseFloat(taxPrice ?? "0"),
        totalPrice: parseFloat(totalPrice ?? "0"),
        orderItems: cartItems.map((item) => ({
          quantity: item.quantity,
          productId: item.id,
        })),
        shippingAddressId: shippingAddress.id,
      };

      const response = await axios({
        method: "POST",
        url: "/api/order",
        data,
      });

      clearCart();
      router.push(`/order/${response.data.order.id}`);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: err?.message,
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  useEffect(() => {
    if (params.get("status") === "success") {
      createNewOrder();
    }
  }, [params, cartItems]);

  if (!cartItems) return <></>;

  return (
    <div className="container mb-auto mt-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="lg:w-2/3">
          <p className="text-3xl font-semibold mb-6">Shipping Address</p>
          {shippingAddress && (
            <p className="mb-4">{`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zipcode}, ${shippingAddress.country}`}</p>
          )}
          <Separator className="my-4 h-[2px]" />
          <p className="text-3xl font-semibold mb-6">Order Items</p>
          {cartItems &&
            cartItems.map((item, i) => (
              <div className="flex gap-6 items-center mb-6" key={item.id}>
                <div className="w-8 h-8 relative">
                  <Image
                    fill
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <Link
                  href={`/product/${item.id}`}
                  className="link link-hover text-gray-700 font-medium"
                >
                  {item.name}
                </Link>
                <span>{`${item.quantity} x $${item.price} = $${
                  item.quantity * item.price
                }`}</span>
              </div>
            ))}
        </div>
        <Card className="lg:w-1/3 bg-slate-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center mb-2">Order Summary</CardTitle>
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
            <Separator className="mt-4" />
          </CardContent>
          <CardFooter>
            <Button
              variant="primary"
              className="h-[40px] mx-auto"
              onClick={payOrder}
            >
              {isProcessingOrder && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Pay
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrderSummmary;

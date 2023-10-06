"use client";

import Spinner from "@/components/Spinner";
import useCartStore from "@/hooks/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import getStripe from "@/utils/get-stripe";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const OrderSummmary = () => {
  const router = useRouter();
  const params = useSearchParams();
  useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/ordersummary");
    },
  });

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

      error.message && toast.error(error.message);
    } catch (err: any) {
      toast.error(err?.message);
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
      toast.error(err?.message);
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

  if (isProcessingOrder)
    return (
      <div className="flex flex-col w-full">
        <p className="text-2xl font-semibold mb-6">Processing Your Order</p>
        <Spinner />
      </div>
    );

  return (
    <div className="container mb-auto mt-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="lg:w-2/3">
          <p className="text-3xl font-semibold mb-6">Shipping Address</p>
          {shippingAddress && (
            <p className="mb-4">{`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zipcode}, ${shippingAddress.country}`}</p>
          )}
          <div className="divider my-4" />
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
        <div className="lg:w-1/3 card shadow-lg">
          <div className="card-body justify-between items-center">
            <p className="card-title text-2xl font-semibold my-2">
              Order Summary
            </p>
            <div className="divider my-1" />
            <div className="flex w-full">
              <span className="flex-1">Items</span>
              <span className="flex-1">{`$${itemsPrice}`}</span>
            </div>
            <div className="divider my-2" />
            <div className="flex w-full">
              <span className="flex-1">Shipping</span>
              <span className="flex-1">{`$${shippingPrice}`}</span>
            </div>
            <div className="divider my-2" />
            <div className="flex w-full">
              <span className="flex-1">Tax</span>
              <span className="flex-1">{`$${taxPrice}`}</span>
            </div>
            <div className="divider my-2" />
            <div className="flex w-full">
              <span className="flex-1">Total</span>
              <span className="flex-1">{`$${totalPrice}`}</span>
            </div>
            <div className="divider my-2" />
            <div className="card-actions">
              <button
                className="btn btn-sm btn-info h-[40px] mt-2"
                onClick={payOrder}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummmary;

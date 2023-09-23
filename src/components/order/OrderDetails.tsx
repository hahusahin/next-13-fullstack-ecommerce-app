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
  } = order;

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
              <div className="alert alert-warning w-fit">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Not Delivered!</span>
                </div>
                {/* <div>
                  <button className="btn btn-sm btn-primary">
                    Mark As Delivered
                  </button>
                </div> */}
              </div>
            </>
          )}
          <div className="divider my-4" />
          <p className="text-2xl font-semibold mb-6">Payment</p>
          <p className="mb-4">
            <span className="font-semibold">Method: </span>
            Stripe
          </p>
          <div className="alert alert-success w-fit">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Paid On: {createdAt.toLocaleString()}</span>
            </div>
          </div>
          <div className="divider my-4" />
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
                  href={`/product/${item.id}`}
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
        <div className="lg:w-1/3 card shadow-lg h-fit">
          <div className="card-body justify-between items-center">
            <p className="card-title text-2xl font-semibold my-2">
              Price Details
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

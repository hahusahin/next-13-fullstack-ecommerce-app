"use client";

import OrderForm from "@/components/cart/OrderForm";
import { useAppSelector } from "@/store";
import React from "react";

const Order = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <div className="container mb-auto mt-6">
      <p className="text-3xl text-center font-bold mb-6">Your Order</p>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="flex-1">
          <OrderForm />
        </div>
        <div className="flex-1">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr key={item.id}>
                  <th>{i + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-lg text-center md:text-end my-4 me-6">
            Total Price: {`$ ${totalPrice.toFixed(2)}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Order;

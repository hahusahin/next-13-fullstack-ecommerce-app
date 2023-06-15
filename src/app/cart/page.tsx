"use client";

import CartItem from "@/components/cart/CartItem";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const router = useRouter();

  return (
    <>
      {cartItems.length > 0 ? (
        <div className="container mb-auto my-4 py-4 text-center">
          <p className="text-2xl font-bold">Your Shopping Cart</p>
          {cartItems.map((item) => (
            <CartItem key={item.id} cartItem={item} />
          ))}
          <p className="text-xl text-center md:text-end my-4 me-6">
            Total Price: {`$ ${totalPrice.toFixed(2)}`}
          </p>
          <button
            className="btn btn-success mt-6"
            onClick={() => router.push("/order")}
          >
            Proceed To Checkout
          </button>
        </div>
      ) : (
        <p className="container text-center text-2xl">
          Your Shopping Cart is Empty!
        </p>
      )}
    </>
  );
};

export default Cart;

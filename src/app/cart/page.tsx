"use client";

import CartItem from "@/components/cart/CartItem";
import useCartStore from "@/hooks/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import { useRouter } from "next/navigation";

const Cart = () => {
  const cartItems = useFromStore(useCartStore, (state) => state.cartItems);
  const itemsPrice = useFromStore(useCartStore, (state) => state.itemsPrice);

  const router = useRouter();

  return (
    <>
      {cartItems && cartItems.length > 0 ? (
        <div className="container mb-auto my-4 py-4 text-center">
          <p className="text-2xl font-bold">Your Shopping Cart</p>
          {cartItems.map((item) => (
            <CartItem key={item.id} cartItem={item} />
          ))}
          <p className="text-xl text-center md:text-end my-4 me-6">
            Total Price: {itemsPrice}
          </p>
          <button
            className="btn btn-success mt-6"
            onClick={() => router.push("/shipping")}
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

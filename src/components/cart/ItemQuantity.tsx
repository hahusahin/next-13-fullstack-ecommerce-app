"use client";

import useCartStore, { CartItem } from "@/hooks/useCartStore";
import { Button } from "../ui/button";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { Input } from "../ui/input";

const ItemQuantity = ({ cartItem }: { cartItem: CartItem }) => {
  const { addToCart, removeFromCart } = useCartStore();

  const { id, quantity } = cartItem;

  const decrementItem = () => {
    removeFromCart(id);
  };

  const incrementItem = () => {
    addToCart(cartItem);
  };

  return (
    <div className="inline-flex text-center items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={quantity <= 1}
        onClick={decrementItem}
      >
        <IoRemoveOutline size="18" />
      </Button>
      <Input
        className="text-center w-12 m-2 bg-transparent"
        type="text"
        readOnly
        value={quantity}
      />
      <Button type="button" variant="ghost" size="icon" onClick={incrementItem}>
        <IoAddOutline size="18" />
      </Button>
    </div>
  );
};

export default ItemQuantity;

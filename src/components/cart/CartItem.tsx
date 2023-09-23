import React from "react";
import ItemQuantity from "./ItemQuantity";
import { BsTrash } from "react-icons/bs";
import Image from "next/image";
import useCartStore, { CartItem } from "@/hooks/useCartStore";

const CartItem = ({ cartItem }: { cartItem: CartItem }) => {
  const { removeFromCart } = useCartStore();
  const { id, name, imageUrl, price, quantity } = cartItem;

  const onDeleteHandler = () => {
    removeFromCart(id, quantity);
  };

  return (
    <div className="flex gap-3 items-center border-[0.1rem] border-orange-200 rounded-lg m-6 p-3">
      <div className="w-12 h-12 relative">
        <Image
          fill
          src={imageUrl}
          alt={name}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="md:text-start">
        <span className="text-xl">{name}</span>
      </div>
      <div className="flex items-center gap-4 justify-center ms-auto">
        <ItemQuantity cartItem={cartItem} />
        <span className="text-xl text-orange-600">{`$ ${(
          price * quantity
        ).toFixed(2)}`}</span>
        <button
          className="btn btn-square btn-outline bg-transparent border-none"
          onClick={onDeleteHandler}
        >
          <BsTrash size="1.25rem" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

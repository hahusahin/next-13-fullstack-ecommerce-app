import React from "react";
import ItemQuantity from "./ItemQuantity";
import { BsTrash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { CartItem, cartActions } from "../../store/cart-slice";
import Image from "next/image";

const CartItem = ({ cartItem }: { cartItem: CartItem }) => {
  const { id, name, imageUrl, quantity, totalPrice } = cartItem;
  const dispatch = useDispatch();

  const onDeleteHandler = () => {
    dispatch(cartActions.deleteFromCart({ id, quantity }));
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
        <span className="text-xl text-orange-600">{`$ ${totalPrice.toFixed(
          2
        )}`}</span>
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

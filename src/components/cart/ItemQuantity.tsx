"use client";

import { useDispatch } from "react-redux";
import { CartItem, cartActions } from "../../store/cart-slice";
import { AppDispatch } from "@/store";

const ItemQuantity = ({ cartItem }: { cartItem: CartItem }) => {
  const { id, quantity } = cartItem;

  const dispatch = useDispatch<AppDispatch>();

  const decrementItem = () => {
    dispatch(cartActions.removeItem(id));
  };

  const incrementItem = () => {
    dispatch(cartActions.addItem(cartItem));
  };

  return (
    <div className="inline-flex text-center items-center">
      <button
        className="btn btn-sm btn-square btn-outline text-xl"
        disabled={quantity <= 1}
        onClick={decrementItem}
      >
        &mdash;
      </button>
      <input
        className="text-center w-8 m-2 bg-transparent"
        type="text"
        readOnly
        value={quantity}
      />
      <button className="btn btn-sm btn-square btn-outline text-xl" onClick={incrementItem}>
        &#xff0b;
      </button>
    </div>
  );
};

export default ItemQuantity;

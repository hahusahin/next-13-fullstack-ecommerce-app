"use client";

import useCartStore, { CartItem } from "@/hooks/useCartStore";

const ItemQuantity = ({ cartItem }: { cartItem: CartItem }) => {
  const {  addToCart, removeFromCart } = useCartStore();

  const { id, quantity } = cartItem;

  const decrementItem = () => {
    removeFromCart(id)
  };

  const incrementItem = () => {
    addToCart(cartItem);
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

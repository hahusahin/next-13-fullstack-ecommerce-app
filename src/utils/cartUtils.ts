import { CartStateTypes } from "@/store/cart-slice";

export const addDecimals = (num: number) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state: CartStateTypes) => {
  // Calculate the items price
  state.itemsPrice = addDecimals(
    state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  // Calculate the shipping price
  state.shippingPrice = addDecimals(+state.itemsPrice > 100 ? 0 : 10);

  // Calculate the tax price
  state.taxPrice = addDecimals(Number((0.15 * +state.itemsPrice).toFixed(2)));

  // Calculate the total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  //Save the cart to localStorage
  // localStorage.setItem("cart", JSON.stringify(state));

  return state;
};

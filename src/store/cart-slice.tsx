import { updateCart } from "@/utils/cartUtils";
import { Product, ShippingAddress } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

export type CartItem = Product & { quantity: number; totalPrice: number };

export interface CartStateTypes {
  items: CartItem[];
  cartQuantity: number;
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
  shippingAddress: Omit<ShippingAddress, "userId"> | undefined;
}

const initialCartState = {
  items: [],
  cartQuantity: 0,
  shippingAddress: undefined,
  itemsPrice: "",
  shippingPrice: "",
  taxPrice: "",
  totalPrice: "",
} as CartStateTypes;

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addItem(state, action) {
      const foundItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (foundItem) {
        foundItem.quantity++;
        foundItem.totalPrice += action.payload.price;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          totalPrice: action.payload.price,
        });
      }
      state.cartQuantity++;
      return updateCart(state);
    },
    removeItem(state, action) {
      const selectedItem = state.items.find(
        (item) => item.id === action.payload
      )!;
      selectedItem.quantity--;
      selectedItem.totalPrice -= selectedItem.price;
      state.cartQuantity--;
      return updateCart(state);
    },
    deleteFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      state.cartQuantity -= action.payload.quantity;
      return updateCart(state);
    },
    clearCart(state) {
      state.items = [];
      state.cartQuantity = 0;
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;

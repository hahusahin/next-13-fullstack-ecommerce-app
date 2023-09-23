import { SafeProduct } from "@/types";
import { ShippingAddress } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const addDecimals = (num: number) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export type CartItem = SafeProduct & { quantity: number };
export type Address = Omit<ShippingAddress, "userId">;

interface State {
  cartItems: CartItem[];
  cartQuantity: number;
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
  shippingAddress?: Address;
}

interface Actions {
  addToCart: (item: SafeProduct) => void;
  removeFromCart: (itemId: string, qty?: number) => void;
  clearCart: () => void;
  addAddressToCart: (address: Address) => void;
}

export type CartStore = State & Actions;

const initialCartState = {
  cartItems: [],
  cartQuantity: 0,
  itemsPrice: "",
  shippingPrice: "",
  taxPrice: "",
  totalPrice: "",
  shippingAddress: undefined,
};

const useCartStore = create(
  persist<CartStore>(
    (set, get) => ({
      ...initialCartState,
      addToCart: (product: SafeProduct) => {
        const cartItems = get().cartItems;
        const foundItem = cartItems.find((item) => item.id === product.id);

        const updatedItems = foundItem
          ? cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: (item.quantity as number) + 1 }
                : item
            )
          : [...cartItems, { ...product, quantity: 1 }];

        const itemsPrice = addDecimals(
          updatedItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          )
        );
        const shippingPrice = addDecimals(+itemsPrice > 100 ? 0 : 10);
        const taxPrice = addDecimals(Number(+itemsPrice * 0.15));
        const totalPrice = addDecimals(
          Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)
        );

        set((state) => ({
          cartItems: updatedItems,
          cartQuantity: state.cartQuantity + 1,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }));
      },
      removeFromCart: (productId: string, qty = 1) => {
        const cartItems = get().cartItems;
        const foundItem = cartItems.find((item) => item.id === productId)!;

        const updatedItems =
          foundItem.quantity > qty
            ? cartItems.map((item) =>
                item.id === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
            : cartItems.filter((item) => item.id !== productId);

        const itemsPrice = addDecimals(
          updatedItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          )
        );
        const shippingPrice = addDecimals(+itemsPrice > 100 ? 0 : 10);
        const taxPrice = addDecimals(Number(+itemsPrice * 0.15));
        const totalPrice = addDecimals(
          Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)
        );

        set((state) => ({
          cartItems: updatedItems,
          cartQuantity: state.cartQuantity - qty,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }));
      },
      clearCart: () => set(() => initialCartState),
      addAddressToCart: (shippingAddress: Address) =>
        set((state) => ({ ...state, shippingAddress })),
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;

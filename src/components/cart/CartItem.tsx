import React from "react";
import ItemQuantity from "./ItemQuantity";
import { BsTrash } from "react-icons/bs";
import Image from "next/image";
import useCartStore, { CartItem } from "@/hooks/useCartStore";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { IoTrashBinOutline } from "react-icons/io5";

const CartItem = ({ cartItem }: { cartItem: CartItem }) => {
  const { removeFromCart } = useCartStore();
  const { id, name, imageUrl, price, quantity } = cartItem;

  const onDeleteHandler = () => {
    removeFromCart(id, quantity);
  };

  return (
    <Card className="my-4 px-4 py-2">
        <div className="flex gap-3 items-center">
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDeleteHandler}
            >
              <IoTrashBinOutline size="18" />
            </Button>
          </div>
        </div>
    </Card>
  );
};

export default CartItem;

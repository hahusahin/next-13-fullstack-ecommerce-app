"use client";

import useCartStore from "@/hooks/useCartStore";
import { SafeProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { TiShoppingCart } from "react-icons/ti";

const ProductItem = ({ data }: { data: SafeProduct }) => {
  const { addToCart } = useCartStore();

  return (
    <Card>
      <CardContent className="flex flex-col justify-between gap-4 py-6 h-full">
        <div className="w-full h-[150px] relative">
          <Link href={`/product/${data.id}`}>
            <Image
              src={data.imageUrl}
              alt={data.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </Link>
        </div>
        <div className="flex-1">
          <Link href={`/product/${data.id}`}>
            <p className="card-title">{data.name}</p>
          </Link>
          <div className="text-yellow-600 text-2xl my-1">
            {[...Array(5)].map((_, index) =>
              index < data.rating ? (
                <span key={index}>&#9733;</span>
              ) : (
                <span key={index}>&#9734;</span>
              )
            )}
          </div>
          <p className="text-orange-500 font-semibold">{`$ ${data.price}`}</p>
        </div>
        <Button
          variant="outline-primary"
          className="w-full"
          onClick={() => addToCart(data)}
        >
          ADD TO CART
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductItem;

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

const ProductItem = ({ data }: { data: SafeProduct }) => {
  const { addToCart } = useCartStore();

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent className="d-flex justify-between items-center text-center">
        <Link href={`/product/${data.id}`}>
          <div className="w-full h-[150px] relative">
            <Image
              src={data.imageUrl}
              alt={data.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <p className="card-title text-lg my-2">{data.name}</p>
          <p className="text-orange-500 font-semibold">{`$ ${data.price}`}</p>
        </Link>
      </CardContent>
      <CardFooter>
        <Button
          variant="primary"
          className="mx-auto"
          onClick={() => addToCart(data)}
        >
          ADD TO CART
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductItem;

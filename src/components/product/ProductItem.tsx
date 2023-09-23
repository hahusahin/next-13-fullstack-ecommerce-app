"use client";

import useCartStore from "@/hooks/useCartStore";
import { SafeProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";

const ProductItem = ({ data }: { data: SafeProduct }) => {
  const { addToCart } = useCartStore();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body justify-between items-center text-center">
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
        <div className="card-actions">
          <button
            className="btn btn-sm btn-info h-[40px] mt-2"
            onClick={() => addToCart(data)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

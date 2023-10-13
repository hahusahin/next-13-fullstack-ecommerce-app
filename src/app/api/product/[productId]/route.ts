import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

interface IParams {
  productId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const { productId } = params;

  const session = await getServerSession(authOptions);

  if (!session || !productId)
    return NextResponse.json(
      { message: "Not authorized" },
      { status: 500 }
    );

  const body = await request.json();
  const { rating, review } = body;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      reviews: true,
    },
  });

  if (!product)
    return NextResponse.json(
      { message: "Product Not Found!" },
      { status: 500 }
    );

  const hasAlreadyReviewed = !!product.reviews.find(
    (review) => review.userId === session.user.id
  );

  if (hasAlreadyReviewed)
    return NextResponse.json(
      { message: "You have already reviewed this product" },
      { status: 403 }
    );

  const oldRating = product.rating;
  const numOfReviews = product.reviews.length;
  const newRating = (oldRating * numOfReviews + rating) / (numOfReviews + 1);

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: newRating,
    },
  });

  const comment = await prisma.review.create({
    data: {
      rating,
      review,
      productId,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ comment }, { status: 200 });
}

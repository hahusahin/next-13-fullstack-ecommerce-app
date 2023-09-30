import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

interface IParams {
  productId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();
  const { productId } = params;

  if (!currentUser || !productId)
    return NextResponse.json(
      { error: "Something went wrong" },
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
      { error: "Something went wrong" },
      { status: 500 }
    );

  const hasAlreadyReviewed = !!product.reviews.find(
    (review) => review.userId === currentUser.id
  );

  if (hasAlreadyReviewed)
    return NextResponse.json(
      { error: "You have already reviewed this product" },
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
      userId: currentUser.id,
    },
  });

  return NextResponse.json({ comment }, { status: 200 });
}

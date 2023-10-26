import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 5;
    const search = searchParams.get("search") ?? "";

    const [products, count] = await prisma.$transaction([
      prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { name: { contains: search, mode: "insensitive" } },
      }),
      prisma.product.count(),
    ]);

    const typeSafeProducts = products.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
    }));

    return NextResponse.json({ products: typeSafeProducts, count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong ! Please try again later" },
      {
        status: 500,
      }
    );
  }
}

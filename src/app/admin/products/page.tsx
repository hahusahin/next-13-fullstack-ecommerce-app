import prisma from "@/lib/prismadb";
import AllProducts from "@/components/admin/AllProducts";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PaginationControl from "@/components/PaginationControl";

interface ProductsProps {
  page?: number;
  limit?: number;
  search?: string;
}

async function getProducts({
  page = 1,
  limit = 10,
  search = "",
}: ProductsProps) {
  try {
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
    return { products: typeSafeProducts, count };
  } catch (err: any) {
    throw new Error(err);
  }
}

export interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const AdminProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "ADMIN") notFound();

  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = searchParams.limit ? Number(searchParams.limit) : 5;
  const search = searchParams.search ? searchParams.search.toString() : "";

  const { products, count } = await getProducts({ page, limit, search });
  const pageCount = Math.ceil(count / limit);

  return (
    <div className="flex flex-col">
      <AllProducts products={products} />
      <PaginationControl
        currentPage={page}
        pageCount={pageCount}
        previousPage={`/admin/products?page=${page - 1}`}
        nextPage={`/admin/products?page=${page + 1}`}
      />
    </div>
  );
};

export default AdminProductsPage;

import prisma from "@/lib/prismadb";
import ProductItem from "@/components/product/ProductItem";
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

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomePageProps) {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = searchParams.limit ? Number(searchParams.limit) : 5;
  const search = searchParams.search ? searchParams.search.toString() : "";

  const { products, count } = await getProducts({ page, limit, search });
  const pageCount = Math.ceil(count / limit);

  return (
    <div className="container h-full flex flex-col gap-6">
      <div
        className="
        py-6
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4
        2xl:grid-cols-5
        gap-4
      "
      >
        {products.map((product) => (
          <ProductItem key={product.id} data={product} />
        ))}
      </div>
      <PaginationControl
        currentPage={page}
        pageCount={pageCount}
        previousPage={`?page=${page - 1}`}
        nextPage={`?page=${page + 1}`}
      />
    </div>
  );
}

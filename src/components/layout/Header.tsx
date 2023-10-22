"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdComputer } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import useCartStore from "@/hooks/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const { data: session } = useSession();

  const cartQuantity = useFromStore(
    useCartStore,
    (state) => state.cartQuantity
  );

  const user = session && session.user;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (!search) {
        current.delete("search");
      } else {
        current.set("search", search);
      }

      if (current.has("page")) current.set("page", "1");

      const query = current.toString() ? `?${current.toString()}` : "";

      router.push(`${pathname}${query}`);
    }
  }, [pathname, router, search, searchParams, debouncedSearch]);

  return (
    <div className="container py-2 flex justify-between items-center">
      <Link href="/" className="flex gap-2 items-center">
        <MdComputer size="32px" />
        <span className="text-lg">E-Shop</span>
      </Link>
      <div className="flex gap-4">
        <Input
          placeholder="Search Product"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="warning">Search</Button>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost">Home</Button>
        </Link>
        {!user && (
          <Button variant="ghost" onClick={() => signIn()}>
            Login
          </Button>
        )}
        <Link href="/cart">
          <Button variant="ghost" className="flex gap-1">
            <TiShoppingCart size={20} />
            <span>Cart</span>
            <Badge
              variant="warning"
              className={
                !cartQuantity || cartQuantity === 0 ? "hidden" : "text-md"
              }
            >
              {cartQuantity}
            </Badge>
          </Button>
        </Link>
        {user && user.role === "CUSTOMER" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 relative cursor-pointer">
                <Image
                  fill
                  src={user.image || "/images/avatar.png"}
                  alt="avatar"
                  className="rounded-full"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={`/account`}>My Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span onClick={() => signOut({ callbackUrl: "/" })}>
                  Signout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {user && user.role === "ADMIN" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="destructive">ADMIN</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={`/admin/products`}>Products</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/admin/orders`}>Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/admin/users`}>Users</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Signout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Header;

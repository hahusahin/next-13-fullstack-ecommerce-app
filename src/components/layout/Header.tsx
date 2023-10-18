"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdComputer } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { User } from "@prisma/client";
import useCartStore from "@/hooks/useCartStore";
import useFromStore from "@/hooks/useFromStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge, badgeVariants } from "../ui/badge";

const Header: FC = () => {
  const { data: session } = useSession();
  const cartQuantity = useFromStore(
    useCartStore,
    (state) => state.cartQuantity
  );

  const user = session && session.user;

  return (
    <div className="container py-2 flex justify-between">
      <Link href="/" className="flex gap-2 items-center">
        <MdComputer size="32px" />
        <span className="text-lg">E-Shop</span>
      </Link>
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
            <TiShoppingCart size="1.25rem" />
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

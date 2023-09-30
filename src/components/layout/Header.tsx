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

const Header: FC = () => {
  const { data: session } = useSession();
  const cartQuantity = useFromStore(
    useCartStore,
    (state) => state.cartQuantity
  );

  const user = session && (session.user as User);

  return (
    <div className="container py-2 flex justify-between">
      <Link href="/" className="flex gap-2 items-center">
        <MdComputer size="32px" />
        <span className="text-lg">Products</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="btn btn-ghost hover:bg-transparent normal-case text-base"
        >
          Home
        </Link>
        {!user && (
          <button
            className="btn btn-ghost hover:bg-transparent normal-case text-base"
            onClick={() => signIn()}
          >
            Login
          </button>
        )}
        <Link
          href="/cart"
          className="btn btn-ghost hover:bg-transparent normal-case text-base"
        >
          <TiShoppingCart size="1.25rem" />
          <span className="mx-2">Cart</span>
          <span
            className={`badge badge-warning badge-md rounded-full ${
              !cartQuantity || cartQuantity === 0 ? "hidden" : ""
            }`}
          >
            {cartQuantity}
          </span>
        </Link>
        {user && user.role === "CUSTOMER" && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="avatar cursor-pointer">
              <div className="w-9">
                <Image
                  fill
                  src={user.image || "/images/avatar.png"}
                  alt="avatar"
                  className="rounded-full"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link
                  href={`/account`}
                  className="btn btn-ghost normal-case text-base"
                >
                  My Account
                </Link>
              </li>
              <li>
                <button
                  className="btn btn-ghost normal-case text-base"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Signout
                </button>
              </li>
            </ul>
          </div>
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
              <DropdownMenuItem>Orders</DropdownMenuItem>
              <DropdownMenuItem>Users</DropdownMenuItem>
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

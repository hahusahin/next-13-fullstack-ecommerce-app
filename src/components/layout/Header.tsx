"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FC } from "react";
import { MdComputer } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

const Header: FC = () => {
  const { data: session } = useSession();

  const user = session && session.user;

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
          Cart
        </Link>
        {user && (
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
                  href="/profile"
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
      </div>
    </div>
  );
};

export default Header;

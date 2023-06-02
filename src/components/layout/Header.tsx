"use client";

import { Link } from "@chakra-ui/next-js";
import { Button } from "@/components/ChakraUIComponents";
import { signIn, signOut, useSession } from "next-auth/react";
import { FC } from "react";
import { MdComputer } from "react-icons/md";
import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

const Header: FC = () => {
  const { data: session } = useSession();

  const user = session && session.user;

  return (
    <div className="container py-2 flex justify-between">
      <Link href="/" className="flex gap-2 items-center">
        <MdComputer size="32px" />
        <span className="text-lg">Products</span>
      </Link>
      <Flex alignItems="center">
        <Button as={Link} href="/" variant="ghost" fontWeight="medium">
          Home
        </Button>
        {!user && (
          <Button variant="ghost" fontWeight="medium" onClick={() => signIn()}>
            Login
          </Button>
        )}
        <Button as={Link} href="/cart" variant="ghost" fontWeight="medium">
          Cart
        </Button>
        {user && (
          <Menu>
            <Avatar
              as={MenuButton}
              size="sm"
              name={user.name as string}
              src={user.image ? user.image : undefined}
              overflow="hidden"
            />
            <MenuList>
              <MenuItem as={Button} fontWeight="medium">
                <Link href="/profile">My Account</Link>
              </MenuItem>
              <MenuItem
                as={Button}
                fontWeight="medium"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Signout
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </div>
  );
};

export default Header;

"use client";

import { SafeUser } from "@/types";
import { Order, ShippingAddress } from "@prisma/client";
import { IoCartOutline, IoHomeOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import UpdateAddressForm from "./UpdateAddressForm";
import UpdateUserForm from "./UpdateUserForm";
import OrdersTable from "./OrdersTable";

export interface ProfileProps {
  user: SafeUser & {
    orders: Order[];
    addresses: ShippingAddress[];
    isSocialLogin: boolean;
  };
}

const Account = ({ user }: ProfileProps) => {
  return (
    <div className="container mb-auto mt-6">
      <p className="text-2xl font-bold mb-8">My Account</p>
      <Tabs
        defaultValue="profile"
        className="flex flex-col lg:flex-row gap-4 lg:gap-12"
      >
        <div className="lg:w-1/4">
          <TabsList className="flex flex-col h-auto gap-4 items-start">
            <TabsTrigger className="text-lg rounded-md px-6" value="profile">
              <MdAccountCircle size="24" className="mr-2" />
              My Profile
            </TabsTrigger>
            <TabsTrigger className="text-lg rounded-md px-6" value="address">
              <IoHomeOutline size="24" className="mr-2" />
              My Addresses
            </TabsTrigger>
            <TabsTrigger className="text-lg rounded-md px-6" value="orders">
              <IoCartOutline size="24" className="mr-2" />
              My Orders
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="lg:w-3/4">
          <TabsContent value="profile" className="mt-0">
            <UpdateUserForm user={user} />
          </TabsContent>
          <TabsContent value="address">
            <UpdateAddressForm user={user} />
          </TabsContent>
          <TabsContent value="orders">
            <p className="text-2xl font-bold mb-4">My Orders</p>
            <OrdersTable orders={user.orders} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Account;

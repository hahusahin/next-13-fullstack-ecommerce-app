"use client";

import { SafeUser } from "@/types";
import { Order, ShippingAddress } from "@prisma/client";
import { IoCartOutline, IoCloseOutline, IoHomeOutline } from "react-icons/io5";
import moment from "moment";
import Link from "next/link";
import UpdateUserModal from "./UpdateUserModal";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MdAccountCircle } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import UpdateAddressForm from "./UpdateAddressForm";
import UpdateUserForm from "./UpdateUserForm";

export interface ProfileProps {
  user: SafeUser & {
    orders: Order[];
    addresses: ShippingAddress[];
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
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Id</th>
                  <th>Date</th>
                  <th>Total Price</th>
                  <th>Delivered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {user.orders.map((order, i) => (
                  <tr key={order.id}>
                    <td>{i + 1}</td>
                    <td>{order.id}</td>
                    <td>
                      {moment(order.createdAt).format("DD-MM-YYYY, HH-mm A")}
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isDelivered ? (
                        moment(order.deliveredAt).format("DD-MM-YYYY, HH-mm A")
                      ) : (
                        <IoCloseOutline size={20} color="red" />
                      )}
                    </td>
                    <td>
                      <Link
                        className="btn btn-sm btn-info"
                        href={`/order/${order.id}`}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Account;

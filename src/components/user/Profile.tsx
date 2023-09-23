"use client";

import { SafeUser } from "@/types";
import { Order, OrderItem, User } from "@prisma/client";
import { IoCloseOutline } from "react-icons/io5";
import moment from "moment";
import Link from "next/link";
import UpdateUserForm from "./UpdateUserForm";

export interface ProfileProps {
  user: SafeUser & {
    orders: Order[];
  };
}

const Profile = ({ user }: ProfileProps) => {
  return (
    <div className="container mb-auto mt-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="lg:w-1/4">
          <p className="text-2xl font-bold text-center mb-4">Your Profile</p>
          <UpdateUserForm user={user} />
        </div>
        <div className="lg:w-3/4">
          <p className="text-2xl font-bold text-center mb-4">
            Purchase History
          </p>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;

"use client";

import { SafeOrder, SafeUser } from "@/types";
import { Order, OrderItem, User } from "@prisma/client";
import moment from "moment";

interface ProfileProps {
  user: SafeUser & {
    orders: SafeOrder[];
  };
}

const Profile = ({ user }: ProfileProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
      <div className="flex-1">
        <p className="text-2xl font-bold text-center mb-4">Your Profile</p>
        <table className="table text-xl">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{user.name || "-"}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{user.email || "-"}</td>
            </tr>
            <tr>
              <td>City</td>
              <td>{user.city || "-"}</td>
            </tr>
            <tr>
              <td>Zip Code</td>
              <td>{user.zipcode || "-"}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{user.address || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold text-center mb-4">Purchase History</p>
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Status</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {user.orders.map((order, i) => (
              <tr key={order.id}>
                <th>{i + 1}</th>
                <td>{moment(order.date).format("DD-MM-YYYY HH-mm")}</td>
                <td>{order.status}</td>
                <td>{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;

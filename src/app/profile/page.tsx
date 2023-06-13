"use client";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session } = useSession();
  const user = session && (session.user as User);

  if (!user) return null;

  return (
    <div className="overflow-x-auto">
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
  );
};

export default Profile;

import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, password, city, zipcode, address } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      city,
      zipcode,
      address,
    },
  });

  const { hashedPassword: _, ...safeUser } = user;

  return NextResponse.json(safeUser);
}

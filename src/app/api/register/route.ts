import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password, country, city } = body;

    const alreadyExistUser = await prisma.user.findUnique({ where: { email } });

    if (alreadyExistUser)
      return NextResponse.json(null, {
        status: 409,
        statusText: "User Already Exists",
      });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        country,
        city,
      },
    });

    const { hashedPassword: _, ...safeUser } = newUser;

    return NextResponse.json(safeUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(null, {
      status: 500,
      statusText: "Something went wrong ! Please try again later",
    });
  }
}

import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password, country, city } = body;

    const alreadyExistUser = await prisma.user.findUnique({ where: { email } });

    if (alreadyExistUser)
      return NextResponse.json(
        { message: "User Already Exists" },
        { status: 409 }
      );

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
    return NextResponse.json(
      { message: "Something went wrong ! Please try again later" },
      {
        status: 500,
      }
    );
  }
}

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser)
    return NextResponse.json({ message: "User Not Found" }, { status: 404 });

  const body = await request.json();

  const { name, email, password, country, city } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name,
      email,
      hashedPassword,
      country,
      city,
    },
  });

  const { hashedPassword: _, ...safeUser } = user;

  return NextResponse.json(safeUser);
}

import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: "User Not Found" }, { status: 404 });

  const body = await request.json();

  const { name, email, password, country, city } = body;

  const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      email,
      country,
      city,
      ...(hashedPassword && { hashedPassword }),
    },
  });

  const { hashedPassword: _, ...safeUser } = user;

  return NextResponse.json(safeUser);
}

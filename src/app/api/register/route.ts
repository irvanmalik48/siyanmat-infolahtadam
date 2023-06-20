import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface RegisterBody {
  username: string;
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();

  const { username, name, email, password, confirmPassword } =
    Object.fromEntries(
      formData.entries() as IterableIterator<[keyof RegisterBody, string]>
    );

  if (password !== confirmPassword) {
    return new NextResponse(
      JSON.stringify({ message: "Passwords do not match" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      name,
      password: hashedPassword,
    },
  });

  return new NextResponse(JSON.stringify({ message: "User created", user }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

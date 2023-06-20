import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UpdatePasswordBody {
  username: string;
  password: string;
  confirmPassword: string;
  oldPassword: string;
}

// for updating the user's password
export async function PATCH(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();

  const { username, password, confirmPassword, oldPassword } =
    Object.fromEntries(
      formData.entries() as IterableIterator<[keyof UpdatePasswordBody, string]>
    );

  if (password !== confirmPassword) {
    return new NextResponse(
      JSON.stringify({ message: "Passwords do not match" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    return new NextResponse(JSON.stringify({ message: "Invalid password" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    where: { username },
    data: {
      password: hashedPassword,
    },
  });

  return new NextResponse(
    JSON.stringify({ message: "Password updated", updatedUser }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

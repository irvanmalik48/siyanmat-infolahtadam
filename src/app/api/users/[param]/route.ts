import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequestWithAuth } from "next-auth/middleware";
import fs from "fs";

const prisma = new PrismaClient();

interface UpdateUserBody {
  username: string;
  email: string;
  name: string;
  role?: string;
}

interface UpdateUserPictureBody {
  email: string;
  image: string;
}

interface DeleteUserBody {
  username: string;
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      param: string;
    };
  }
) {
  const { param } = params;

  let user;

  if (param === "all") {
    user = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
    });

    return new NextResponse(
      JSON.stringify(
        user.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }))
      ),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  user = await prisma.user.findFirst({
    where: { OR: [{ email: param }, { username: param }] },
  });
  return new NextResponse(
    JSON.stringify({
      id: user?.id,
      username: user?.username,
      email: user?.email,
      name: user?.name,
      image: user?.image,
      role: user?.role,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

// This will be used for updating the user's profile
export async function PATCH(
  req: NextRequestWithAuth,
  {
    params: { param },
  }: {
    params: {
      param: string;
    };
  }
) {
  const formData = await req.formData();

  const { username, name, email, role } = Object.fromEntries(
    formData.entries() as IterableIterator<[keyof UpdateUserBody, string]>
  );

  if (!username || !name || !email) {
    return new NextResponse(JSON.stringify({ message: "Missing fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (role !== user.role) {
    if (user.role !== "superadmin") {
      return new NextResponse(
        JSON.stringify({
          message: "You are not authorized to update the user's role",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      username,
      email,
      name,
      role,
    },
  });

  return new NextResponse(
    JSON.stringify({ message: "User updated", user: updatedUser }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// This will be used for updating the user's profile picture
export async function PUT(req: NextRequestWithAuth) {
  const formData = await req.formData();

  const { email, image } = Object.fromEntries(
    formData.entries() as IterableIterator<
      [keyof UpdateUserPictureBody, string]
    >
  );

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      image,
    },
  });

  return new NextResponse(
    JSON.stringify({ message: "User updated", user: updatedUser }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// This will be used for deleting a user (only superadmin can do this)
// This uses the getServerSession function from next-auth to get the user's session
export async function DELETE(req: NextRequestWithAuth) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ message: "You are not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const superAdmin = await prisma.user.findFirst({
    where: { email: session.user.email as string },
  });

  if (!superAdmin || superAdmin.role !== "superadmin") {
    return new NextResponse(
      JSON.stringify({ message: "You are not authorized to delete a user" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const formData = await req.formData();

  const { username } = Object.fromEntries(
    formData.entries() as IterableIterator<[keyof DeleteUserBody, string]>
  );

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const deletedUser = await prisma.user.delete({
    where: { id: user.id },
  });

  // remove user's image
  const imageExists = fs.existsSync(process.cwd() + `/public${user.image}`);

  if (imageExists) {
    fs.unlinkSync(process.cwd() + `/public${user.image}`);
  }

  return new NextResponse(JSON.stringify({ message: "User deleted" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

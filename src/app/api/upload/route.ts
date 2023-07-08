import { NextResponse } from "next/server";
import * as fs from "fs";
import { Session, getServerSession } from "next-auth";
import { NextRequestWithAuth } from "next-auth/middleware";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequestWithAuth) {
  const formData = await req.formData();
  const searchParams = req.nextUrl.searchParams;
  const session = await getServerSession();

  const image = formData.get("image") as File;
  let isEditingOtherUser = formData.has("email");
  let otherUser: User | null = null;

  if (isEditingOtherUser) {
    otherUser = await prisma.user.findUnique({
      where: {
        email: formData.get("email") as string,
      },
    });
  }

  let imageUrl;

  if (searchParams.has("type")) {
    const type = searchParams.get("type");

    if (type === "user" || typeof type === "undefined") {
      imageUrl = await uploadUserImage(
        image,
        isEditingOtherUser ? otherUser : session
      );
    } else if (type === "tool") {
      imageUrl = await uploadToolImage(
        image,
        searchParams.get("toolCode") as string
      );
    }
  }

  return new NextResponse(JSON.stringify({ imageUrl }), {
    headers: { "Content-Type": "application/json" },
  });
}

async function uploadUserImage(image: File, user: Session | User | null) {
  if (!user) return null;

  if ("user" in user) {
    return await uploadImage(image, "users", user.user?.image as string);
  }

  if ("id" in user) {
    return await uploadImage(image, "users", user.image as string);
  }

  return null;
}

async function uploadToolImage(image: File, toolCode?: string) {
  let tool;

  if (toolCode) {
    tool = await prisma.tool.findUnique({
      where: {
        toolCode,
      },
    });
  }

  return await uploadImage(image, "tools", tool?.image as string);
}

async function uploadImage(
  image: File,
  directory: string,
  oldImageUrl?: string
) {
  if (!image) return null;

  await handleUploadDirectory();

  const definedDirectoryExists = fs.existsSync(
    process.cwd() + `/public/uploads/${directory}`
  );

  if (!definedDirectoryExists) {
    fs.mkdirSync(process.cwd() + `/public/uploads/${directory}`);
  }

  const oldImageUrlExists = fs.existsSync(
    process.cwd() + `/public${oldImageUrl}`
  );

  if (oldImageUrlExists) {
    fs.unlinkSync(process.cwd() + `/public${oldImageUrl}`);
  }

  const uuid = crypto.randomUUID();
  const newFileName = uuid + "." + image.name.split(".").pop();

  // store the image in the uploads folder
  const path = process.cwd() + `/public/uploads/${directory}/` + newFileName;
  const imageBuffer = await image.arrayBuffer();
  const arrayBufferToBuffer = Buffer.from(imageBuffer);

  fs.writeFileSync(path, arrayBufferToBuffer);

  return `/uploads/${directory}/` + newFileName;
}

async function handleUploadDirectory() {
  const directoryExists = fs.existsSync(process.cwd() + "/public/uploads");

  if (!directoryExists) {
    fs.mkdirSync(process.cwd() + "/public/uploads");
  }
}

import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";

interface UploadBody {
  image: File;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();
  const searchParams = req.nextUrl.searchParams;

  const { image } = Object.fromEntries(
    formData.entries() as IterableIterator<[keyof UploadBody, File]>
  );

  let imageUrl;
  
  if (searchParams.has("type")) {
    const type = searchParams.get("type");

    if (type === "user" || typeof type === "undefined") {
      imageUrl = await uploadUserImage(image);
    } else if (type === "tool") {
      imageUrl = await uploadToolImage(image);
    }
  }

  return new NextResponse(JSON.stringify({ imageUrl }), {
    headers: { "Content-Type": "application/json" },
  });
}

async function uploadUserImage(image: File) {
  return await uploadImage(image, "users");
}

async function uploadToolImage(image: File) {
  return await uploadImage(image, "tools");
}

async function uploadImage(image: File, directory: string) {
  if (!image) return null;

  await handleUploadDirectory();

  const definedDirectoryExists = fs.existsSync(
    process.cwd() + `/public/uploads/${directory}`
  );

  if (!definedDirectoryExists) {
    fs.mkdirSync(process.cwd() + `/public/uploads/${directory}`);
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

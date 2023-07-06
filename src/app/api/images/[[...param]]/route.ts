import fs from "fs";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, {
  params: {
    param,
  },
}: {
  params: {
    param?: string[];
  };
}) {
  if (param && param.length) {
    const publicDir = __dirname.split(".next")[0] + "public";
    const fileUrl = param.join("/");

    const file = fs.readFileSync(`${publicDir}/${fileUrl}`);

    return new NextResponse(
      file,
    );
  }
}
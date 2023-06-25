import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequestWithAuth } from "next-auth/middleware";
import fs from "fs";

const prisma = new PrismaClient();

interface CreateToolBody {
  toolCode: string;
  name: string;
  brand: string;
  maxHourUsage: number;
  hourUsageLeft: number;
  image?: File;
  isAvailable: boolean;
}

interface UpdateToolBody {
  toolCode: string;
  name: string;
  brand: string;
  maxHourUsage: number;
  hourUsageLeft: number;
  isAvailable: boolean;
}

interface UpdateToolImageBody {
  toolCode: string;
  image: string;
}

export async function GET(req: NextRequest, {
  params,
}: {
  params: {
    param?: string;
  };
}) {
  const toolCode = params.param;
  let getAll = true;

  if (toolCode !== "get") {
    getAll = false;
  }

  let tools: any;

  if (getAll) {
    tools = await prisma.tool.findMany({
      select: {
        id: true,
        toolCode: true,
        name: true,
        brand: true,
        maxHourUsage: true,
        hourUsageLeft: true,
        image: false,
        isAvailable: true,
      }
    });
  } else {
    tools = await prisma.tool.findFirst({
      where: {
        toolCode: toolCode,
      },
    });
  }

  return new NextResponse(
    JSON.stringify(tools),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Create a new tool
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const { toolCode, name, brand, maxHourUsage, image, isAvailable } = Object.fromEntries(
    formData.entries() as IterableIterator<[keyof CreateToolBody, string | undefined]>
  );

  if (!toolCode || !name || !brand || !maxHourUsage || !image || !isAvailable) {
    return new NextResponse(
      JSON.stringify({
        error: "Missing fields",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const tool = await prisma.tool.create({
    data: {
      toolCode: toolCode as string,
      name: name as string,
      brand: brand as string,
      maxHourUsage: Number(maxHourUsage),
      hourUsageLeft: Number(maxHourUsage),
      image: image as string,
      isAvailable: isAvailable === "true" ? true : false,
    },
  });

  return new NextResponse(
    JSON.stringify(tool),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Update a tool
export async function PATCH(req: NextRequestWithAuth) {
  const formData = await req.formData();

  const { toolCode, name, brand, maxHourUsage, hourUsageLeft, isAvailable } = Object.fromEntries(
    formData.entries() as IterableIterator<[keyof UpdateToolBody, string | undefined]>
  );

  if (!toolCode || !name || !brand || !maxHourUsage || !hourUsageLeft || !isAvailable) {
    return new NextResponse(
      JSON.stringify({
        error: "Missing fields",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const tool = await prisma.tool.update({
    where: {
      toolCode: toolCode as string,
    },
    data: {
      toolCode: toolCode as string,
      name: name as string,
      brand: brand as string,
      maxHourUsage: Number(maxHourUsage),
      hourUsageLeft: Number(hourUsageLeft),
      isAvailable: isAvailable === "true" ? true : false,
    },
  });

  return new NextResponse(
    JSON.stringify(tool),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Update a tool's image
export async function PUT(req: NextRequestWithAuth) {
  const formData = await req.formData();

  const { toolCode, image } = Object.fromEntries(
    formData.entries() as IterableIterator<[keyof UpdateToolImageBody, string | undefined]>
  );

  if (!toolCode || !image) {
    return new NextResponse(
      JSON.stringify({
        error: "Missing fields",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const tool = await prisma.tool.update({
    where: {
      toolCode: toolCode as string,
    },
    data: {
      image: image,
    },
  });

  return new NextResponse(
    JSON.stringify(tool),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Delete a tool
export async function DELETE(req: NextRequestWithAuth, {
  params,
}: {
  params: {
    param?: string;
  };
}) {
  const toolCode = params.param;

  if (!toolCode) {
    return new NextResponse(
      JSON.stringify({
        error: "Missing fields",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const tool = await prisma.tool.delete({
    where: {
      toolCode: toolCode as string,
    },
  });

  // delete the image from the server
  const imageExists = fs.existsSync(process.cwd() + `/public${tool.image}`);

  if (imageExists) {
    fs.unlinkSync(process.cwd() + `/public${tool.image}`);
  }

  return new NextResponse(
    JSON.stringify(tool),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

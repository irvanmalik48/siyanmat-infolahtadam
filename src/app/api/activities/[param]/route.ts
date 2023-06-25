import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ActivityBody {
  activityCode: string;
  name: string;
  description: string;
  date: string;
  operatorName: string;
  toolCode: string;
  toolUsage: number;
}

export async function GET(req: NextRequest, {
  params: {
    param,
  },
}: {
  params: {
    param?: string;
  };
}) {
  const activityCode = param;

  let getAll = true;

  if (activityCode !== "get") {
    getAll = false;
  }

  let activities;

  if (getAll) {
    activities = (await prisma.activity.findMany()).sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });
  } else {
    activities = await prisma.activity.findFirst({
      where: {
        activityCode,
      },
      include: {
        tool: true,
      },
    });
  }

  return new NextResponse(
    JSON.stringify(activities),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const {
    activityCode,
    name,
    description,
    date,
    operatorName,
    toolCode,
    toolUsage,
  } = Object.fromEntries(
    formData.entries() as IterableIterator<[keyof ActivityBody, string]>
  );

  if (!activityCode || !name || !description || !date || !operatorName || !toolCode || !toolUsage) {
    return new NextResponse(
      JSON.stringify({
        error: "Missing fields",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const activity = await prisma.activity.create({
    data: {
      activityCode,
      name,
      description,
      date: new Date(date),
      operatorName,
      toolCode,
      toolUsage: parseInt(toolUsage),
    },
  });

  return new NextResponse(
    JSON.stringify(activity),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();

  const {
    activityCode,
    name,
    description,
    date,
    operatorName,
    toolCode,
    toolUsage,
  } = Object.fromEntries(
    formData.entries() as IterableIterator<[keyof ActivityBody, string]>
  );

  if (!activityCode || !name || !description || !date || !operatorName || !toolCode || !toolUsage) {
    return new NextResponse(
      JSON.stringify({
        error: "Missing fields",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const activity = await prisma.activity.update({
    where: {
      activityCode,
    },
    data: {
      name,
      description,
      date: new Date(date),
      operatorName,
      toolCode,
      toolUsage: parseInt(toolUsage),
    },
  });

  return new NextResponse(
    JSON.stringify(activity),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function DELETE(req: NextRequest) {
  const formData = await req.formData();

  const {
    activityCode,
  } = Object.fromEntries(
    formData.entries() as IterableIterator<[keyof ActivityBody, string]>
  );

  if (!activityCode) {
    return new NextResponse(
      JSON.stringify({
        error: "Missing fields",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const activity = await prisma.activity.delete({
    where: {
      activityCode,
    },
  });

  return new NextResponse(
    JSON.stringify(activity),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

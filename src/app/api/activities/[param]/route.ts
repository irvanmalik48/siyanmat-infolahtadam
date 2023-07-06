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
    activities = (await prisma.activity.findMany({
      include: {
        tool: {
          select: {
            toolCode: true,
            name: true,
          },
        },
      },
    })).sort((a, b) => {
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

  const tool = await prisma.tool.findFirst({
    where: {
      toolCode,
    },
  });

  if (!tool) {
    return new NextResponse(
      JSON.stringify({
        error: "Tool not found",
      }),
      {
        status: 404,
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

  await prisma.tool.update({
    where: {
      toolCode,
    },
    data: {
      hourUsageLeft: tool.hourUsageLeft - parseInt(toolUsage),
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

export async function PATCH(req: NextRequest, {
  params: {
    param,
  },
}: {
  params: {
    param?: string;
  };
}) {
  const activityCodeFromParams = param;
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

  const oldActivity = await prisma.activity.findFirst({
    where: {
      activityCode,
    },
    select: {
      toolUsage: true,
      toolCode: true,
    },
  });

  const tool = await prisma.tool.findFirst({
    where: {
      toolCode,
    },
  });

  if (!tool) {
    return new NextResponse(
      JSON.stringify({
        error: "Tool not found",
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (toolCode !== oldActivity?.toolCode) {
    await prisma.tool.update({
      where: {
        toolCode: oldActivity?.toolCode,
      },
      data: {
        hourUsageLeft: tool.hourUsageLeft + (oldActivity?.toolUsage as number),
      },
    });
  }

  const activity = await prisma.activity.update({
    where: {
      activityCode: activityCodeFromParams as string,
    },
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

  await prisma.tool.update({
    where: {
      toolCode,
    },
    data: {
      hourUsageLeft: tool.hourUsageLeft - parseInt(toolUsage) + (oldActivity?.toolUsage as number),
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

export async function DELETE(req: NextRequest, {
  params: {
    param,
  },
}: {
  params: {
    param?: string;
  };
}) {
  const activityCode = param;

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

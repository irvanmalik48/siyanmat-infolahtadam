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

export async function GET(
  req: NextRequest,
  {
    params: { param },
  }: {
    params: {
      param?: string;
    };
  }
) {
  const activityCode = param;

  let getAll = true;

  if (activityCode !== "get") {
    getAll = false;
  }

  let activities;

  if (getAll) {
    activities = (
      await prisma.activity.findMany({
        include: {
          tools: {
            include: {
              tool: true,
            },
          },
        },
      })
    ).sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });
  } else {
    activities = await prisma.activity.findFirst({
      where: {
        activityCode,
      },
      include: {
        tools: {
          include: {
            tool: true,
          },
        },
      },
    });
  }

  return new NextResponse(JSON.stringify(activities), {
    headers: {
      "Content-Type": "application/json",
    },
  });
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

  if (
    !activityCode ||
    !name ||
    !description ||
    !date ||
    !operatorName ||
    !toolCode ||
    !toolUsage
  ) {
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

  const splittedToolCodes = toolCode.split(",");

  const tools = await prisma.tool.findMany({
    where: {
      toolCode: {
        in: splittedToolCodes,
      },
    },
  });

  if (!tools || tools.length === 0) {
    return new NextResponse(
      JSON.stringify({
        error: "Tool(s) not found",
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
      toolUsage: parseInt(toolUsage),
      tools: {
        create: tools.map((tool) => {
          return {
            tool: {
              connect: {
                toolCode: tool.toolCode,
              },
            },
          };
        }),
      },
    },
  });

  return new NextResponse(JSON.stringify(activity), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PATCH(
  req: NextRequest,
  {
    params: { param },
  }: {
    params: {
      param?: string;
    };
  }
) {
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

  if (
    !activityCode ||
    !name ||
    !description ||
    !date ||
    !operatorName ||
    !toolCode ||
    !toolUsage
  ) {
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

  const splittedToolCodes = toolCode.split(",");

  const oldActivity = await prisma.activity.findFirst({
    where: {
      activityCode,
    },
    select: {
      toolUsage: true,
      tools: {
        select: {
          tool: {
            select: {
              toolCode: true,
            },
          },
        },
      },
    },
  });

  const tool = await prisma.tool.findMany({
    where: {
      toolCode: {
        in: splittedToolCodes,
      },
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
      toolUsage: parseInt(toolUsage),
      tools: {
        deleteMany: {
          toolId: {
            notIn: splittedToolCodes,
          },
        },
        create: tool.map((tool) => {
          return {
            tool: {
              connect: {
                toolCode: tool.toolCode,
              },
            },
          };
        }),
      },
    },
    include: {
      tools: {
        include: {
          tool: true,
        },
      },
    },
  });

  return new NextResponse(JSON.stringify(activity), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(
  req: NextRequest,
  {
    params: { param },
  }: {
    params: {
      param?: string;
    };
  }
) {
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

  const activity = await prisma.activity.findFirst({
    where: {
      activityCode,
    },
    include: {
      tools: {
        include: {
          tool: true,
        },
      },
    },
  });

  if (!activity) {
    return new NextResponse(
      JSON.stringify({
        error: "Activity not found",
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  await prisma.activityAndTool.deleteMany({
    where: {
      activity: {
        activityCode,
      }
    }
  })

  const activityToBeDeleted = await prisma.activity.delete({
    where: {
      activityCode,
    },
  });

  return new NextResponse(JSON.stringify(activityToBeDeleted), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

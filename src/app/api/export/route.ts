import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Workbook, Worksheet } from "exceljs";

const prisma = new PrismaClient();

type DataType = "activities" | "tool" | "tools";

interface RequestDataActivities {
  startDate: string;
  endDate: string;
}

interface RequestData {
  title: string;
  type: DataType;
  sortBy: string;
  formatFile: string;
  data: RequestDataActivities | string;
}

export async function POST(req: NextRequest) {
  const workbook = new Workbook();

  const formData = await req.formData();

  let reqData;

  if (formData.get("type") === "activities") {
    reqData = JSON.parse(formData.get("data") as string);
  } else if (formData.get("type") === "tool") {
    reqData = formData.get("data") as string;
  } else if (formData.get("type") === "tools") {
    reqData = formData.get("data") as string;
  }

  const data: RequestData = {
    title: formData.get("title") as string,
    type: formData.get("type") as DataType,
    sortBy: formData.get("sortBy") as string,
    data: reqData,
    formatFile: formData.get("formatFile") as string,
  };

  if (!data) {
    return new NextResponse(
      JSON.stringify({
        message: "No data provided",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let dataFlow: any;

  if (data.type === "activities") {
    dataFlow = await prisma.activity.findMany({
      where: {
        date: {
          gte: new Date((data.data as RequestDataActivities).startDate),
          lte: new Date((data.data as RequestDataActivities).endDate),
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
  } else if (data.type === "tool") {
    dataFlow = await prisma.tool.findFirst({
      where: {
        toolCode: data.data as string,
      },
      include: {
        activities: true,
      },
    });
  } else if (data.type === "tools") {
    dataFlow = await prisma.tool.findMany();
  }

  if (data.sortBy === "date") {
    dataFlow = dataFlow.sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  } else if (data.sortBy === "toolCode") {
    dataFlow = dataFlow.sort((a: any, b: any) => {
      return a.toolCode.localeCompare(b.toolCode);
    });
  } else if (data.sortBy === "activityCode") {
    dataFlow = dataFlow.sort((a: any, b: any) => {
      return a.activityCode.localeCompare(b.activityCode);
    });
  } else if (data.sortBy === "name") {
    dataFlow = dataFlow.sort((a: any, b: any) => {
      return a.name.localeCompare(b.name);
    });
  } else if (data.sortBy === "brand") {
    dataFlow = dataFlow.sort((a: any, b: any) => {
      return a.brand.localeCompare(b.brand);
    });
  } else if (data.sortBy === "operatorName") {
    dataFlow = dataFlow.sort((a: any, b: any) => {
      return a.operatorName.localeCompare(b.operatorName);
    });
  } else if (data.sortBy === "toolName") {
    dataFlow = dataFlow.sort((a: any, b: any) => {
      return a.tool.toolName.localeCompare(b.toolName);
    });
  } else if (data.sortBy === "toolUsage") {
    dataFlow = dataFlow.sort((a: any, b: any) => {
      return a.toolUsage - b.toolUsage;
    });
  } else if (data.sortBy === "toolCodeFromActivity") {
    dataFlow = dataFlow.sort((a: any, b: any) => {
      return a.tool.toolCode.localeCompare(b.tool.toolCode);
    });
  }

  let sheet: Worksheet;

  if (data.type === "activities") {
    sheet = workbook.addWorksheet("Kegiatan");

    sheet.addTable({
      name: "Tabel Kegiatan",
      ref: "A1",
      headerRow: true,
      style: {
        theme: "TableStyleMedium2",
        showRowStripes: true,
      },
      columns: [
        { name: "No" },
        { name: "Nama Kegiatan" },
        { name: "Deskripsi" },
        { name: "Tanggal Kegiatan" },
        { name: "Operator" },
        { name: "Nama Peralatan" },
        { name: "Waktu Guna (jam)" },
      ],
      rows: dataFlow?.map((activity: any, index: any) => {
        return [
          index + 1,
          activity.name,
          activity.description,
          activity.date,
          activity.operatorName,
          activity.tools.map((tool: any) => tool.tool.name).join(", "),
          activity.toolUsage,
        ];
      }),
    });

    sheet.getRow(1).font = { bold: true };
    sheet.columns.forEach((column) => {
      column.alignment = { vertical: "middle" };
      column.width = 20;
    });
    sheet.getColumn(1).width = 5;
  } else if (data.type === "tool") {
    sheet = workbook.addWorksheet("Peralatan");

    sheet.mergeCells("B1:C1");
    sheet.mergeCells("B2:C2");
    sheet.mergeCells("B3:C3");
    sheet.mergeCells("B4:C4");
    sheet.mergeCells("B5:C5");

    sheet.getCell("B1").value = "Nama Peralatan";
    sheet.getCell("B1").alignment = { vertical: "middle" };
    sheet.getCell("B1").font = { bold: true };

    sheet.getCell("B2").value = "Merk";
    sheet.getCell("B2").alignment = { vertical: "middle" };
    sheet.getCell("B2").font = { bold: true };

    sheet.getCell("B3").value = "Maksimal Waktu Guna (jam)";
    sheet.getCell("B3").alignment = { vertical: "middle" };
    sheet.getCell("B3").font = { bold: true };

    sheet.getCell("B4").value = "Sisa Waktu Guna (jam)";
    sheet.getCell("B4").alignment = { vertical: "middle" };
    sheet.getCell("B4").font = { bold: true };

    sheet.getCell("B5").value = "Kondisi";
    sheet.getCell("B5").alignment = { vertical: "middle" };
    sheet.getCell("B5").font = { bold: true };

    sheet.mergeCells("D1:E1");
    sheet.mergeCells("D2:E2");
    sheet.mergeCells("D3:E3");
    sheet.mergeCells("D4:E4");
    sheet.mergeCells("D5:E5");
    sheet.mergeCells("D6:E6");

    sheet.getCell("D1").value = dataFlow?.toolCode;
    sheet.getCell("D1").alignment = { vertical: "middle" };

    sheet.getCell("D2").value = dataFlow?.name;
    sheet.getCell("D2").alignment = { vertical: "middle" };

    sheet.getCell("D3").value = dataFlow?.brand;
    sheet.getCell("D3").alignment = { vertical: "middle" };

    sheet.getCell("D4").value = dataFlow?.maxHourUsage;
    sheet.getCell("D4").alignment = { vertical: "middle" };

    sheet.getCell("D5").value = dataFlow?.hourUsageLeft;
    sheet.getCell("D5").alignment = { vertical: "middle" };

    sheet.getCell("D6").value = dataFlow?.condition;
    sheet.getCell("D6").alignment = { vertical: "middle" };

    sheet.addTable({
      name: "Tabel Kegiatan",
      ref: "A8",
      headerRow: true,
      style: {
        theme: "TableStyleMedium2",
        showRowStripes: true,
      },
      columns: [
        { name: "No" },
        { name: "Nama Kegiatan" },
        { name: "Deskripsi" },
        { name: "Tanggal Kegiatan" },
        { name: "Operator" },
        { name: "Waktu Guna (jam)" },
      ],
      rows: dataFlow["activities"].map((activity: any, index: any) => {
        return [
          index + 1,
          activity["activity"].name,
          activity["activity"].description,
          activity["activity"].date,
          activity["activity"].operatorName,
          activity["activity"].toolUsage,
        ];
      }),
    });

    sheet.getRow(8).font = { bold: true };
    sheet.columns.forEach((column) => {
      column.alignment = { vertical: "middle" };
      column.width = 20;
    });
    sheet.getColumn(1).width = 5;
  } else if (data.type === "tools") {
    sheet = workbook.addWorksheet("Semua Peralatan");

    sheet.addTable({
      name: "Tabel Peralatan",
      ref: "A1",
      headerRow: true,
      style: {
        theme: undefined,
        showRowStripes: false,
      },
      columns: [
        { name: "No" },
        { name: "Nama Peralatan" },
        { name: "Merek" },
        { name: "Maksimal Waktu Guna (jam)" },
        { name: "Sisa Waktu Guna (jam)" },
        { name: "Kondisi" },
      ],
      rows: dataFlow?.map((tool: any, index: any) => {
        return [
          index + 1,
          tool.name,
          tool.brand,
          tool.maxHourUsage,
          tool.hourUsageLeft,
          tool.condition,
        ];
      }),
    });

    sheet.getRow(1).font = { bold: true };
    sheet.columns.forEach((column) => {
      column.alignment = { vertical: "middle" };
      column.width = 20;
    });
    sheet.getColumn(1).width = 5;
  }

  workbook.creator = "Infolahtadam II/Swj";
  workbook.title = data.title as string;

  const xlsxFile = await workbook.xlsx.writeBuffer();

  // send back response as file for the client to download
  return new NextResponse(xlsxFile, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=${data.title}.${data.formatFile}`,
    },
  });
}

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const signName = formData.get("signName") as string;
  const sortBy = formData.get("sortBy") as string;
  const nrp = formData.get("nrp") as string;

  if (!signName || !sortBy || !nrp) {
    return new NextResponse(
      JSON.stringify({
        message: "Bad Request",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  let tools = await prisma.tool.findMany({
    include: {
      activities: {
        include: {
          activity: true,
        },
      },
    },
  });

  tools = tools.sort((a, b) => {
    if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    else return 0;
  });

  if (sortBy === "name") {
    // already sorted by name
  } else if (sortBy === "toolCode") {
    tools = tools.sort((a, b) => {
      if (a.toolCode < b.toolCode) return -1;
      else if (a.toolCode > b.toolCode) return 1;
      else return 0;
    });
  } else if (sortBy === "brand") {
    tools = tools.sort((a, b) => {
      if (a.brand < b.brand) return -1;
      else if (a.brand > b.brand) return 1;
      else return 0;
    });
  } else {
    // fallback to default sort by name
  }

  const doc = new jsPDF({
    orientation: "portrait",
  });

  doc.setFontSize(12);
  doc.setFont("Times New Roman");

  const htmlOutput = /* html */ `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body style="font-family: sans-serif; font-size: 12px; display: flex; flex-direction: column;">
    <header style="border-bottom: 2px solid; width: fit-content; border-color: black;">
        <p
            style="text-align: center; width: fit-content; margin: 0;"
        >
            KOMANDO DAERAH MILITER II/SRIWIJAYA
        </p>
        <p
            style="text-align: center; width: 100%; margin: 0; margin-bottom: 1px;"
        >
            INFORMASI DAN PENGOLAHAN DATA
        </p>
    </header>
    <h4 style="width: 100%; text-align: center; margin-top: 50px; margin-bottom: 0;">
        REKAP LAPORAN PERALATAN
    </h4>
    <h5 style="width: 100%; text-align: center; margin-top: 4px;">
        PER TANGGAL ${new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })}
    </h5>
    <table style="border: 1px black solid; border-collapse: collapse; width: 100%; margin-bottom: auto;">
        <thead>
            <tr>
                <th style="border: 1px black solid;">No</th>
                <th style="border: 1px black solid;">Nama Peralatan</th>
                <th style="border: 1px black solid;">Merek</th>
                <th style="border: 1px black solid;">Maks Usia</th>
                <th style="border: 1px black solid;">Sisa Usia</th>
                <th style="border: 1px black solid;">Kondisi</th>
            </tr>
        </thead>
        <tbody>
            ${tools
              .map(
                (tool, index) => /* html */ `
            <tr>
                <td style="border: 1px black solid; text-align: center;">${
                  index + 1
                }</td>
                <td style="border: 1px black solid; text-align: center; text-align: left; padding-left: 5px; padding-right: 5px;">${
                  tool.name
                }</td>
                <td style="border: 1px black solid; text-align: center;">${
                  tool.brand
                }</td>
                <td style="border: 1px black solid; text-align: center;">${
                  tool.maxHourUsage
                } jam</td>
                <td style="border: 1px black solid; text-align: center;">${
                  tool.maxHourUsage -
                  tool.activities.reduce(
                    (acc, curr) => acc + curr.activity.toolUsage,
                    0
                  )
                } jam</td>
                <td style="border: 1px black solid; text-align: center;">${
                  tool.condition
                }</td>
            </tr>
            `
              )
              .join("")}
        </tbody>
    </table>
    <div style="display: flex; width: 100%; flex-direction: column; justify-content: center; align-items: flex-end; margin-top: 20px;">
        <div style="display: flex; min-width: 150px; flex-direction: column; justify-content: center;">
            <p style="width: 100%; text-align: center;">
                Palembang, ${new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
            </p>
            <p style="margin-top: 50px; margin-bottom: 0; width: 100%; text-align: center;">
                ${signName}
            </p>
            <p style="margin: 0; width: 100%; text-align: center;">
                ${nrp}
            </p>
        </div>
    </div>
</body>
</html>
  `;

  return new NextResponse(htmlOutput, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const signName = formData.get("signName") as string;
  const toolCode = formData.get("data") as string;
  const nrp = formData.get("nrp") as string;

  if (!signName || !toolCode || !nrp) {
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

  let tool = await prisma.tool.findFirst({
    where: {
      toolCode,
    },
    include: {
      activities: {
        include: {
          activity: true,
        },
      },
    },
  });

  if (!tool) {
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

  const htmlOutput = /* html */ `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body style="font-family: sans-serif; font-size: 12px; min-height: 50vh; display: flex; flex-direction: column;">
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
        REKAP LAPORAN ALAT
    </h4>
    <h5 style="width: 100%; text-align: center; margin-top: 4px;">
        KODE ALAT: ${tool?.toolCode}
    </h5>
    <p style="margin: 0;">
        <span style="width: 100px; display: inline-block;">Nama Alat</span>: ${
          tool?.name
        }
    </p>
    <p style="margin: 0;">
        <span style="width: 100px; display: inline-block;">Merek</span>: ${
          tool?.brand
        }
    </p>
    <p style="margin: 0;">
        <span style="width: 100px; display: inline-block;">Maks Usia</span>: ${
          tool?.maxHourUsage
        } jam
    </p>
    <p style="margin: 0;">
        <span style="width: 100px; display: inline-block;">Sisa Usia</span>: ${
          tool?.maxHourUsage -
          tool?.activities.reduce(
            (acc, curr) => acc + curr.activity.toolUsage,
            0
          )
        } jam
    </p>
    <p style="margin: 0;">
        <span style="width: 100px; display: inline-block;">Kondisi</span>: ${
          tool?.condition
        }
    </p>
    <h4 style="margin-bottom: 0; width: 100%; text-align: center;">
        Daftar Kegiatan
    </h4>
    <table style="border: 1px black solid; border-collapse: collapse; width: 100%; margin-top: 6px; margin-bottom: auto;">
        <thead>
            <tr>
                <th style="border: 1px black solid;">No</th>
                <th style="border: 1px black solid;">Nama Kegiatan</th>
                <th style="border: 1px black solid;">Tanggal</th>
                <th style="border: 1px black solid;">Waktu Guna</th>
                <th style="border: 1px black solid;">Operator</th>
            </tr>
        </thead>
        <tbody>
            ${tool?.activities
              .map(
                (activity, index) => /* html */ `
                <tr>
                    <td style="border: 1px black solid; text-align: center;">${
                      index + 1
                    }</td>
                    <td style="border: 1px black solid; text-align: center; text-align: left; padding-left: 5px; padding-right: 5px;">${
                      activity.activity.name
                    }</td>
                    <td style="border: 1px black solid; text-align: center;">${activity.activity.date.toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      }
                    )}</td>
                    <td style="border: 1px black solid; text-align: center;">${
                      activity.activity.toolUsage
                    } jam</td>
                    <td style="border: 1px black solid; text-align: center;">${
                      activity.activity.operatorName
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
                  month: "long",
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

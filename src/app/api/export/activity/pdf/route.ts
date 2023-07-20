import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const jabatan = formData.get("jabatan") as string;
  const signName = formData.get("signName") as string;
  const sortBy = formData.get("sortBy") as string;
  const nrp = formData.get("nrp") as string;

  if (!startDate || !endDate || !signName || !sortBy || !nrp) {
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

  const startDateDDMMYYYY = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const endDateDDMMYYYY = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  let activities = await prisma.activity.findMany({
    where: {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      tools: {
        include: {
          tool: {
            include: {
              activities: {
                include: {
                  activity: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (sortBy === "date") {
    // do nothing, because it's already sorted by date
  } else if (sortBy === "name") {
    activities = activities.sort((a, b) => {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    });
  } else if (sortBy === "operatorName") {
    activities = activities.sort((a, b) => {
      if (a.operatorName < b.operatorName) return -1;
      else if (a.operatorName > b.operatorName) return 1;
      else return 0;
    });
  } else {
    // fallback to default sort by date
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
          REKAP LAPORAN KEGIATAN
      </h4>
      <h5 style="width: 100%; text-align: center; margin-top: 4px;">
          PER TANGGAL ${startDateDDMMYYYY} - ${endDateDDMMYYYY}
      </h5>
      <table style="border: 1px black solid; border-collapse: collapse; width: 100%; margin-bottom: auto;">
          <thead>
              <tr>
                  <th style="border: 1px black solid; padding-top: 5px; padding-bottom: 5px;" rowspan="2">No</th>
                  <th style="border: 1px black solid; padding-top: 5px; padding-bottom: 5px;" rowspan="2">Nama Kegiatan</th>
                  <th style="border: 1px black solid; padding-top: 5px; padding-bottom: 5px;" rowspan="2">Tanggal</th>
                  <th style="border: 1px black solid; padding-top: 5px; padding-bottom: 5px;" rowspan="1" colspan="2">Alat yang Digunakan</th>
                  <th style="border: 1px black solid; padding-top: 5px; padding-bottom: 5px;" rowspan="2">Operator</th>
              </tr>
              <tr>
                  <th style="border: 1px black solid; padding-top: 5px; padding-bottom: 5px;" rowspan="1" colspan="1">Nama Alat</th>
                  <th style="border: 1px black solid; padding-top: 5px; padding-bottom: 5px;" rowspan="1" colspan="1">Sisa Usia</th>
              </tr>
          </thead>
          <tbody>
              ${activities
                .map((activity, index) => {
                  return /* html */ `
                  <tr>
                      <td style="border: 1px black solid; text-align: center; padding-top: 5px; padding-bottom: 5px;" rowspan="3">${
                        index + 1
                      }</td>
                      <td style="border: 1px black solid; text-align: center; padding-top: 5px; padding-bottom: 5px; text-align: left; padding-left: 5px; padding-right: 5px;" rowspan="3">${
                        activity.name
                      }</td>
                      <td style="border: 1px black solid; text-align: center; padding-top: 5px; padding-bottom: 5px;" rowspan="3">${activity.date.toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        }
                      )}</td>
                      ${activity.tools
                        .slice(0, 1)
                        .map((tool) => {
                          return /* html */ `
                          <td style="border: 1px black solid; text-align: center; padding-top: 5px; padding-bottom: 5px;">${
                            tool.tool.name
                          }</td>
                          <td style="border: 1px black solid; text-align: center; padding-top: 5px; padding-bottom: 5px;">${
                            tool.tool.maxHourUsage -
                            tool.tool.activities.reduce(
                              (acc, curr) => acc + curr.activity.toolUsage,
                              0
                            )
                          } jam</td>
                          `;
                        })
                        .join("")}
                      <td style="border: 1px black solid; text-align: center; padding-top: 5px; padding-bottom: 5px;" rowspan="3">${
                        activity.operatorName
                      }</td>
                  </tr>
                  ${activity.tools
                    .slice(1)
                    .map((tool) => {
                      return /* html */ `
                      <tr>
                          <td style="border: 1px black solid; text-align: center; padding-top: 5px; padding-bottom: 5px;">${
                            tool.tool.name
                          }</td>
                          <td style="border: 1px black solid; text-align: center; padding-top: 5px; padding-bottom: 5px;">${
                            tool.tool.maxHourUsage -
                            tool.tool.activities.reduce(
                              (acc, curr) => acc + curr.activity.toolUsage,
                              0
                            )
                          } jam</td>
                      </tr>
                      `;
                    })
                    .join("")}
                  `;
                })
                .join("")}
          </tbody>
      </table>
      <div style="display: flex; width: 100%; flex-direction: column; justify-content: center; align-items: flex-end; margin-top: 20px;">
          <div style="display: flex; min-width: 150px; flex-direction: column; justify-content: center;">
              <p style="width: 100%; text-align: center; margin-bottom: 0;">
                  Palembang, ${new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </p>
              <p style="margin-top: 0px; margin-bottom: 0; width: 100%; text-align: center;">
                  ${jabatan},
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

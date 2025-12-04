import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const text = fs.readFileSync("./data/sample.csv", "utf-8");
  const lines = text.trim().split("\n").slice(1);
  for (const line of lines) {
    const [si,gu,dong,aptName,contractYM,contractDay,area_m2,floor,price_10k,builtYear] = line.split(",");
    await prisma.transaction.upsert({
      where: { id: `${aptName}-${contractYM}-${contractDay}-${area_m2}-${floor}`.replace(/\s+/g,"_") },
      update: {},
      create: {
        si, gu, dong, aptName, contractYM, contractDay,
        area_m2: Number(area_m2), floor: floor? Number(floor): null,
        price_10k: Number(price_10k), builtYear: builtYear? Number(builtYear): null,
      }
    });
  }
  console.log("ingest done");
}
main().finally(()=>prisma.$disconnect());

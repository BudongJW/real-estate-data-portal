import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const QuerySchema = z.object({
  si: z.string().optional(),
  gu: z.string().optional(),
  ym: z.string().regex(/^\d{6}$/).optional(), // 202501
  limit: z.coerce.number().min(1).max(1000).default(100),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    si: searchParams.get("si") ?? undefined,
    gu: searchParams.get("gu") ?? undefined,
    ym: searchParams.get("ym") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { si, gu, ym, limit } = parsed.data;

  const where: any = {};
  if (si) where.si = si;
  if (gu) where.gu = gu;
  if (ym) where.contractYM = ym;

  const rows = await prisma.transaction.findMany({
    where,
    orderBy: { contractYM: "desc" },
    take: limit,
  });

  // 간단 캐시 헤더(1시간)
  return new NextResponse(JSON.stringify(rows), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" },
  });
}

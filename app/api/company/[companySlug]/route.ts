import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { companyName: string } }
) {
  const { companyName } = params;
  try {
    const company = await prisma.company.findFirst({
      where: { slug: companyName },
      select: {
        id: true,
        coverImage: true,
        image: true,
        description: true,
        name: true,
      },
    });

    return NextResponse.json({ data: company }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error occured" },
      { status: 5000 }
    );
  }
}

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

const CACHE_KEY = "admin:all-users";
const CACHE_DURATION = 300; // 5 minutes in seconds

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin (you'll need to implement this check based on your user model)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Try to get from cache first
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from database
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const response = {
      totalUsers: users.length,
      users,
    };

    // Set to cache
    await redis.setex(CACHE_KEY, CACHE_DURATION, JSON.stringify(response));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
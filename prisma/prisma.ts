import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// Define the extended type
type ExtendedPrismaClient = ReturnType<typeof extendPrisma>;

// Helper to apply accelerate
function extendPrisma() {
  return new PrismaClient().$extends(withAccelerate());
}

// Store in globalThis
const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

// Reuse or create
export const prisma = globalForPrisma.prisma ?? extendPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

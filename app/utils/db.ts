import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
    // errorFormat: "pretty",
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  // if (globalForPrisma.prisma) {
  //   globalForPrisma.prisma.$disconnect()
  // }
  globalForPrisma.prisma = prisma
}

export default prisma


import { PrismaClient } from "@prisma/client"; // Correct import path

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
    errorFormat: "pretty",

  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

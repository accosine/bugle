import { Prisma, PrismaClient } from "@prisma/client";
export import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;
export function createContext(ctx: any): Promise<Context>;
export * from ".prisma/client/index.d";
export interface Context {
  prisma: PrismaClient;
}

import type { PrismaClient } from "@prisma/client";
export { PrismaClientKnownRequestError } from "@prisma/client/runtime";
export function createContext(ctx: any): Promise<Context>;
export * from ".prisma/client/index.d";
export interface Context {
  prisma: PrismaClient;
}

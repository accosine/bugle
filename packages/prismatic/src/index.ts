// import { PrismaClient } from "@prisma/client";
// import { Context } from "./index.d";

// const prisma = new PrismaClient();

// const createContext = async (ctx: any): Promise<Context> => {
//// Skip if you are not using a serverless environment
// ctx.callbackWaitsForEmptyEventLoop = false;

// return { ...ctx, prisma };
// };
// export default createContext;
import { Prisma } from "@prisma/client";
export { PrismaClient } from "@prisma/client";
export import PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError;
export { Prisma } from "@prisma/client";

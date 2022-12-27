// import { PrismaClient } from "@prisma/client";
// import { Context } from "./index.d";

// const prisma = new PrismaClient();

// const createContext = async (ctx: any): Promise<Context> => {
//// Skip if you are not using a serverless environment
// ctx.callbackWaitsForEmptyEventLoop = false;

// return { ...ctx, prisma };
// };
// export default createContext;
export { PrismaClient } from "@prisma/client";
export { PrismaClientKnownRequestError } from "@prisma/client/runtime";

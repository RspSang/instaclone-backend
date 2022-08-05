import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { IResolvers } from "@graphql-tools/utils";
import { DocumentNode } from "graphql";

const typeDefsArray: any[] = loadFilesSync(`${__dirname}/**/*.typeDefs.ts`);
const resolversArray: any[] = loadFilesSync(`${__dirname}/**/*.resolvers.ts`);

export const typeDefs: DocumentNode = mergeTypeDefs(typeDefsArray);
export const resolvers: IResolvers = mergeResolvers(resolversArray);

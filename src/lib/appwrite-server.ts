import { Client, TablesDB, Users } from "node-appwrite";

if (
  !process.env.APPWRITE_ENDPOINT ||
  !process.env.APPWRITE_PROJECT_ID ||
  !process.env.APPWRITE_API_KEY
) {
  throw new Error("Missing Appwrite server environment variables");
}

const serverClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const users = new Users(serverClient);
const tables = new TablesDB(serverClient);

export { serverClient, tables, users };

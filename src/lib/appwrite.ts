import { Client, Account, Databases } from "node-appwrite";

let client: Client | null = null;

function getClient() {
  if (!client) {
    if (
      !process.env.APPWRITE_ENDPOINT ||
      !process.env.APPWRITE_PROJECT_ID ||
      !process.env.APPWRITE_API_KEY
    ) {
      throw new Error("Missing Appwrite environment variables");
    }

    client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
  }

  return client;
}

export function getAccount() {
  return new Account(getClient());
}

export function getDatabases() {
  return new Databases(getClient());
}

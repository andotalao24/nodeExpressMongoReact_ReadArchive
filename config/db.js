import { MongoClient } from "mongodb";
import dns from "dns";

// Force a public DNS resolver so Atlas SRV lookups work on restrictive networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let db;
const connectDB = async () => {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
  });
  await client.connect();
  db = client.db();
  await db
    .collection("books")
    .createIndex({ title: "text", author: "text", description: "text" });
  console.log("MongoDB connected");
};
export const getDB = () => db;
export default connectDB;

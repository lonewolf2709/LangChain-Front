import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import { CosmosClient } from "@azure/cosmos";
dotenv.config();
const app = express();
app.use(bodyParser.json());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Disable SSL certificate validation for the emulator
// Initialize CosmosClient
const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});
async function setupDatabase() {
  // Check if the database exists, and create it if not
  const { database } = await client.databases.createIfNotExists({ id: 'cosmicworks' });

  // Check if the container exists, and create it if not
  const { container } = await database.containers.createIfNotExists({
    id: 'emailid',
    partitionKey: { kind: 'Hash', paths: ['/email'] }
  });

  return container;
}
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
const port = 4000;
app.get('/', function (req, res) {
  res.send("Hello World");
});
app.post("/", async (req, res) => {
  console.log("Received POST request");

  const { message,isPositive } = req.body;
  console.log("Message:", message);
  console.log("Liked:",isPositive);

  try {
    const container = await setupDatabase(); // Ensure the container is ready
    // Query to check if the email already exists
    const { resources } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: message }]
      })
      .fetchAll();
    if (resources.length > 0) {
      // Email already exists
      res.status(400).json({ error: "Email ID already exists." });
    } else {
      // Insert the new email ID
      const { resource } = await container.items.create({ email: message , liked:isPositive});
      console.log("Inserted item:", resource);
      res.json({
        data: "Email ID is recorded. Thanks"
      });
    }
  } catch (error) {
    console.error("Error inserting item:", error);
    res.status(500).json({ error: "An error occurred while recording the email ID." });
  }
});
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

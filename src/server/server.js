// AVAILABLE ON PORT 3000
export const API_HOST = "http://localhost:3000";

import cors from 'cors'
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

import path from "path";
import bodyParser from "body-parser";

const app = express();

const uri =
  "mongodb+srv://s3953344:UN5GA54Hz1iax6mm@dba-cluster.8zloe.mongodb.net/?retryWrites=true&w=majority&appName=DBA-Cluster";
const client = new MongoClient(uri);

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

const db = client.db("sample_airbnb");

connectToDatabase();

// Serve static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("This is the hooome page");
});

// Route for serving the add.html page
app.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "add.html"));
});

function formatGetReq(req) {
  const findQuery = {};
  if (req.query.bedrooms) { findQuery.bedrooms = parseInt(req.query.bedrooms) }
  if (req.query.property_type) { findQuery.property_type = req.query.property_type }
  // make market search case-insensitive
  if (req.query["address.market"]) {
    findQuery["address.market"] = new RegExp(
      `^${req.query["address.market"]}$`,
      "i"
    );
  }
  return findQuery;
}

// API endpoint
app.get("/api/data", async (req, res, next) => {
  try {
    const findQuery = {};
    if (req.query.bedrooms) { findQuery.bedrooms = parseInt(req.query.bedrooms) }
    if (req.query.property_type) { findQuery.property_type = req.query.property_type }
    // make market search case-insensitive
    if (req.query["address.market"]) {
      findQuery["address.market"] = new RegExp(
        `^${req.query["address.market"]}$`,
        "i"
      );
    }
    
    // default limit to 8
    const limit = req.query.limit ? parseInt(req.query.limit) : 8;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    
    // for some reason, X-Total-Count does not show up as a header
    // so AAAAAAAAAAAHHHH
    // const count = await db.collection("listingsAndReviews").countDocuments(findQuery);
    const data = await db.collection("listingsAndReviews").find(findQuery).skip(offset).limit(limit).toArray();
    // res.status(200).set("X-Total-Count", count.toString()).json(data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch data from MongoDB", error);
    next(error);
  }
});

// I need an entire separate endpoint for totalcount because HEADERS WONT GO THROUGH
app.get("/api/data/count", async (req, res, next) => {
  try {
    const findQuery = {};
    if (req.query.bedrooms) { findQuery.bedrooms = parseInt(req.query.bedrooms) }
    if (req.query.property_type) { findQuery.property_type = req.query.property_type }
    // make market search case-insensitive
    if (req.query["address.market"]) {
      findQuery["address.market"] = new RegExp(
        `^${req.query["address.market"]}$`,
        "i"
      );
    }
    
    const count = await db.collection("listingsAndReviews").countDocuments(findQuery);
    res.status(200).json(count);
  } catch (error) {
    console.error("Failed to fetch data from MongoDB", error);
    next(error);
  }
});

app.get("/api/data/:id", async (req, res, next) => {
  try {
    const data = await db.collection("listingsAndReviews").findOne({_id: req.params.id});
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch data from MongoDB", error);
    next(error);
  }
});

// API endpoint for adding data
app.post("/api/data", async (req, res, next) => {
  try {
    // The push operator will create a bookings field if not already present. So convenient! Wow!!!
    db.collection("listingsAndReviews").updateOne(
      { _id: req.body.listingId },
      {
        $push: {
          bookings: 
            {...req.body.data, _id: new ObjectId()}
        }
      }
    );
    res.status(201);
  } catch (error) {
    next(error);
  }
});

// Error handlers
app.use((req, res, next) => {
  res.status(404).send("Not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

// Start the server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

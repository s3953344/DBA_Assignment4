// AVAILABLE ON PORT 3000
const API_HOST = "http://localhost:3000";

import cors from 'cors'
import express from "express";
import { MongoClient } from "mongodb";

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

// API endpoint
app.get("/api/data", async (req, res, next) => {
  try {
    // Do not include any blank fields in the given query param
    const findQuery = {};
    for (const property in req.query) {
      if (req.query[property] != "") { findQuery[property] = req.query[property] }
    }
    if (findQuery.bedrooms) {
      findQuery.bedrooms = parseInt(findQuery.bedrooms);
    }
    // TODO: REMOVE THIS LIMIT!!!!
    const data = await db.collection("listingsAndReviews").find(findQuery).limit(5).toArray();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch data from MongoDB", error);
    next(error);
  }
});

app.get("/api/data/:id", async (req, res, next) => {
  try {
    const data = await db.collection("listingsAndReviews").findOne({_id: req.params.id});
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch data from MongoDB", error);
    next(error);
  }
});

// MY DATA ################################# DELETE LATER
app.get("/api/test", async (req, res, next) => {
  // const data = await db
  //   .collection("listingsAndReviews")
  //   .findOne({ name: "Be Happy in Porto" });
  const data = await db
    .collection("listingsAndReviews")
    .distinct("property_type");
  // const listings = db.collection("listingsAndReviews");
  // const data = await listings.findOne({ name: "Be Happy in Porto" });
  console.log(data);
  res.send(data);
});

// API endpoint for adding data
app.post("/api/data", async (req, res, next) => {
  try {
    // const { mvNumb, age } = req.body;
    const { mvNumb, mvTitle, yrMade, mvType, Crit, MPAA, Noms, Awrd, dirNumb } =
      req.body;

    // Validate that all data are present
    /*
    if (!mvNumb || !age) {
      res.status(400).json({ error: 'Please provide both name and age' });
      return;
    }

    // Validate that the age is a number
    if (isNaN(age)) {
      res.status(400).json({ error: 'Age must be a number' });
      return;
    }
*/

    if (
      !mvNumb ||
      !mvTitle ||
      !yrMade ||
      !mvType ||
      !Crit ||
      !MPAA ||
      !Noms ||
      !Awrd ||
      !dirNumb
    ) {
      res.status(400).json({ error: "Please provide all information" });
      return;
    }

    // Validate that the age is a number
    if (isNaN(mvNumb)) {
      res.status(400).json({ error: "Movie Number must be a number" });
      return;
    }
    if (isNaN(yrMade)) {
      res.status(400).json({ error: "Year Made must be a number" });
      return;
    }
    if (isNaN(Crit)) {
      res.status(400).json({ error: "No. Crits must be a number" });
      return;
    }
    if (isNaN(Noms)) {
      res.status(400).json({ error: "No. Nominations must be a number" });
      return;
    }
    if (isNaN(Awrd)) {
      res.status(400).json({ error: "No. Awards must be a number" });
      return;
    }
    if (isNaN(dirNumb)) {
      res
        .status(400)
        .json({ error: "Director Number Awards must be a number" });
      return;
    }
    // Insert the data into MongoDB
    //const result = await db.collection('Movie').insertOne({mvNumb, age });
    const result = await db.collection("Movie").insertOne({
      mvNumb,
      mvTitle,
      yrMade,
      mvType,
      Crit,
      MPAA,
      Noms,
      Awrd,
      dirNumb,
    });

    res.status(201).json({ id: result.insertedId });
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

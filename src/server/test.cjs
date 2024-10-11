const express = require('express');
const { MongoClient } = require('mongodb');

const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const uri = "mongodb+srv://s3953344:UN5GA54Hz1iax6mm@dba-cluster.8zloe.mongodb.net/?retryWrites=true&w=majority&appName=DBA-Cluster";
const client = new MongoClient(uri);

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

const db = client.db("listingsAndReviews");

connectToDatabase();
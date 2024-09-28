const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { ObjectId } = require("mongodb");

const { connectToDb, getDb } = require("./db");

const app = express();
app.use(express.json());

const corsOption = {
  origin:
    process.env.NODE_ENV === "development"
      ? "*" //Allow all origins in development
      : process.env.VITE_FRONTEND_URI, // Allow only specific frontend URL in production
};

app.use(cors(corsOption));

// Logs HTTPS requests to the console
app.use(morgan("dev"));

const port = process.env.PORT || 8080;

// db connection - if successful, listen for any request
let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } else {
    console.error("Failed to connect to the databse.");
  }
});

// Routes
// Get all the landmarks
app.get("/api/landmarks", (req, res) => {
  let landmarks = [];
  db.collection("landmarks")
    .find()
    .forEach((place) => landmarks.push(place))
    .then(() => {
      res.status(200).json(landmarks);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch" });
    });
});

// Add a landmark
app.post("/api/landmarks", (req, res) => {
  const landmark = req.body;

  db.collection("landmarks")
    .insertOne(landmark)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new landmark document" });
    });
});

// Get all the questions
app.get("/api/questions", (req, res) => {
  let questions = [];
  db.collection("questions")
    .find()
    .forEach((question) => questions.push(question))
    .then(() => {
      res.status(200).json(questions);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch" });
    });
});

// Add a question
app.post("/api/questions", (req, res) => {
  const question = req.body;

  db.collection("questions")
    .insertOne(question)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create a new question document" });
    });
});

// Update a question by ID
app.put("/api/questions/:id", (req, res) => {
  const questionId = req.params.id;
  const updatedQuestion = req.body;

  db.collection("questions")
    .updateOne({ _id: new ObjectId(questionId) }, { $set: updatedQuestion })
    .then((result) => {
      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Question updated successfully" });
      } else {
        res
          .status(404)
          .json({ message: "Question not found or no changes made" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not update the question" });
    });
});

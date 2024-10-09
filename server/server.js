const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
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
    console.error("Failed to connect to the database.");
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
      res.status(500).json({ error: "Could not create a new landmark document" });
    });
});

// Get all scavenger hunt locations
app.get("/api/hunt-locations", (req, res) => {
  let huntLocations = [];
  db.collection("huntLocations")
    .find()
    .forEach((location) => huntLocations.push(location))
    .then(() => {
      res.status(200).json(huntLocations);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch" });
    });
});

// Add a scavenger hunt location
app.post("/api/hunt-locations", authToken, (req, res) => {
  const huntLocation = req.body;
  const user = req.user
  console.log("scavenger hunt user", user)

  db.collection("huntLocations")
    .insertOne(huntLocation)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not create a new hunt location document" });
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
      res.status(500).json({ error: "Could not create a new question document" });
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


// Add an user
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if the email or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const userExists = await db.collection("users").findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    
    // Insert the new user into the database
    const result = await db.collection("users").insertOne({
      email,
      password: hash,
      profileImg: "",
      points: 0
    });

    if (result.acknowledged) {
      const newUser = await db.collection("users").findOne({_id: result.insertedId });
      const accessToken = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET)
      res.status(201).json({ accessToken: accessToken, user: newUser });
    }
  } catch (err) {
    res.status(500).json({ err: "Could not create a new user" });
  }
});

// Login an user
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if the email or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
    const user = await db.collection("users").findOne({email})

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
     return res.status(401).json({ error: "Invalid credentials" });
    }
  
    // If successful, you can create a session, JWT, or simply return a success message
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).json({ accessToken: accessToken, user: user });

  } catch (err) {
    res.status(500).json({ error: "An error occurred during login" });
  }
})

// MiddleWare
function authToken(req, res, next) {
  const authHeader = req.headers['Authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null ) return res.sendStatus(401).json({message: "No auth token, access denied"})

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403).json({message: " Token verification failed"})
    res.user = user
    next()  
  })  
}


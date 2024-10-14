const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectToDb, getDb } = require("./db");
const { sendThankYouEmail, sendResetEmail } = require("./mail");

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
      res
        .status(500)
        .json({ error: "Could not create a new landmark document" });
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
app.post("/api/hunt-locations", (req, res) => {
  const huntLocation = req.body;

  db.collection("huntLocations")
    .insertOne(huntLocation)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Could not create a new hunt location document" });
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
      res
        .status(500)
        .json({ error: "Could not create a new question document" });
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
    const { email, password, name } = req.body;

    // Check if the email or password is missing
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, username and password are required" });
    }

    // Check if user already exists
    const userExists = await db.collection("users").findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const nameExists = await db.collection("users").findOne({ name });
    if (nameExists) {
      return res
        .status(409)
        .json({ error: "User with this username already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await db.collection("users").insertOne({
      email,
      password: hash,
      name,
      img: "",
      badges: [],
      points: 0,
      completed: [],
      highestQuizScore: 0,
    });

    if (result.acknowledged) {
      const newUser = await db
        .collection("users")
        .findOne({ _id: result.insertedId });
      const accessToken = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET);
      sendThankYouEmail(newUser);
      res.status(201).json({ accessToken: accessToken, user: newUser });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If successful, you can create a session, JWT, or simply return a success message
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({ accessToken: accessToken, user: user });
  } catch (err) {
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Get all users ranked by points
app.get("/api/users/ranking", async (req, res) => {
  try {
    const users = await db
      .collection("users")
      .find()
      .sort({ points: -1, name: 1 }) // Sort them by points in descending order (-1) and by name alphabetically (1)
      .toArray(); // Convert the cursor to an array

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Could not retrieve users" });
  }
});

// Get user data by user ID
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (user) {
      res.status(200).json({ user: user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Could not fetch user data" });
  }
});

// Update user points by user ID
app.put("/api/users/:id/points", async (req, res) => {
  const userId = req.params.id;
  const { points } = req.body; // New point increment (not new point value)

  if (points === undefined) {
    return res.status(400).json({ error: "Points value is required" });
  }

  try {
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $inc: { points: points } });

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "User points updated successfully" });
    } else {
      res.status(404).json({ error: "User not found or no changes made" });
    }
  } catch (err) {
    res.status(500).json({ error: "Could not update user points" });
  }
});

// Update user's completed tasks array by user ID
app.put("/api/users/:id/completed", async (req, res) => {
  const userId = req.params.id;
  const { task } = req.body; // Task to be added to the completed array

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  try {
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { completed: task } }, // $addToSet ensures no duplicates
    );

    if (result.modifiedCount === 1) {
      res
        .status(200)
        .json({ message: "Task added to completed array successfully" });
    } else {
      res
        .status(404)
        .json({ error: "User not found or task already completed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Could not update completed tasks" });
  }
});

// MiddleWare to pass to the routes that needs to be protected
// not added, if do want backend routes to be protected, will need to add headers and token info in frontend during fetch
function authToken(req, res, next) {
  console.log("from authToken", req.headers);
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "No auth token, access denied" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: " Token verification failed" });
    res.user = user;
    next();
  });
}

app.post("/api/reset", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is missing
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" },
    );
    sendResetEmail(user.email, token);
    res.status(201).json({ message: "Email sent. Please check your inbox." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/reset/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(decodedToken.userId) },
        { $set: { password: hash } },
      );

    // const user = await db.collection("users").findOne({_id: new ObjectId(decodedToken.userId)})

    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: "Password changed " });
    } else {
      return res
        .status(401)
        .json({ message: "User not found or password not changed" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made" });
    }

    //find updated User object, to have it return in the response
    const updatedUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

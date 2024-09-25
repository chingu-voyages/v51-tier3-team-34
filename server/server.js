const express = require("express")
const cors = require("cors");
require('dotenv').config()

const { connectToDb, getDb } = require('./db')

const app = express();
app.use(express.json())

const corsOption = {
  origin: process.env.NODE_ENV === "development"
	? "*" //Allow all origins in development
	: process.env.VITE_FRONTEND_URI, // Allow only specific frontend URL in production
}; 

app.use(cors(corsOption));

const port = process.env.PORT || 8080

//db connection - if successful, listen for any request
let db
connectToDb((err)=> {
  if (!err) {
	db = getDb();
    app.listen(port, ()=> {
      console.log(`Server started on port ${port}`);
    });
  } else {
	console.error("Failed to connect to the databse.")
  }
});


// routes
app.get('/api/landmarks', (req, res) => {
	let landmarks = []
	db.collection('landmarks')
		.find()
		.forEach(place => landmarks.push(place))
		.then(() => {
			res.status(200).json(landmarks)
		})
		.catch(()=> {
			res.status(500).json({error: "Could not fetch"})
		})
})


app.post('/api/landmarks', (req, res) => {
	const landmark = req.body

	db.collection('landmarks')
	.insertOne(landmark)
	.then(result => {
		res.status(201).json(result)
	})
	.catch(err => {
		res.status(500).json({err: 'Could not create a new document'})
	})
})

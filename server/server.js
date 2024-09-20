const express = require("express")
const { connectToDb, getDb } = require('./db')
// require('dotenv').config()

const app = express();
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
}; 

app.use(cors(corsOptions));


//db connection - if successful, listen for any request
let db

connectToDb((err)=> {
  if (!err) {
    app.listen(8080, ()=> {
      console.log("Server started on port 8080");
    });
		db = getDb()
  }
})


// routes
app.get('/landmarks', (req, res) => {
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

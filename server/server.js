const express = require("express")
const { connectToDb, getDb } = require('./db')
const landmarks = require('./data/landmarks')


const app = express();
app.use(express.json())

const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:5173"],
}; 

//remove corsOptions in development
app.use(cors());
//use in deployment (development branch)
//app.use(cors(corsOptions))


//db connection - if successful, listen for any request
let db

const port = process.env.PORT || 8080

// connectToDb((err)=> {
//   if (!err) {
//     app.listen(port, ()=> {
//       console.log(`Server started on port ${port}`);
//     });
// 		db = getDb()
//   }
// })
app.listen(port, ()=> {
	console.log(`Server started on port ${port}`);
})

// routes

// app.get('/api/landmarks', (req, res) => {
// 	let landmarks = []

// 	db.collection('landmarks')
// 		.find()
// 		.forEach(place => landmarks.push(place))
// 		.then(() => {
// 			res.status(200).json(landmarks)
// 		})
// 		.catch(()=> {
// 			res.status(500).json({error: "Could not fetch"})
// 		})
// })

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

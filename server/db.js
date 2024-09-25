const { MongoClient } = require('mongodb');
require('dotenv').config()

let dbConnection
const uri = process.env.MONGO_URI

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
			.then((client)=> {
				dbConnection = client.db()
				return cb()
			})
			.catch(err => {
				console.log(err)
				return cb(err)
			})
  },
  getDb: () => dbConnection
}

// What these functions does
// connectToDb - establish connection to database
// getDb - return database connection after already connected
// cb - callback function


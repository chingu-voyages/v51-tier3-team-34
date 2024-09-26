const { MongoClient } = require('mongodb');
require('dotenv').config()

let dbConnection
const uri = process.env.MONGO_URI

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
		.then((client)=> {
			dbConnection = client.db('geoworlddash')
			return cb()
		})
		.catch(err => {
			console.error('Failed to connect to MongoDB', err)
			dbConnection = null;
			return cb(err)
		})
  },
  getDb: () => {
	if (!dbConnection) {
		throw new Error('Database connection is not established');
	}
	return dbConnection;
  }
}

// What these functions does
// connectToDb - establish connection to database
// getDb - return database connection after already connected
// cb - callback function


const { MongoClient } = require('mongodb');

let dbConnection

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect('mongodb://localhost:27017/geodashworld')
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


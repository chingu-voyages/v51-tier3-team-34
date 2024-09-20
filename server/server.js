const express = require("express");
// const axios = require("axios");
// require('dotenv').config()

const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));


//TESTING BELOW - CAN BE DELETED AS NEEDED
app.get("/api", (req, res) => {
    res.json({"fruits": ["apple", "orange", "banana"]})
});

// Below used for fetching information from google places api
// app.get('/historical-landmarks', async (req, res) => {
//     const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//     const location = '38.0406,-84.5037'; // Latitude and Longitude for Lexington, KY
//     const radius = 10000; // Radius in meters (10 km)
    
//     const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=point_of_interest&keyword=historic&key=${apiKey}`);
//     res.json(response.data.results);


// });


app.listen(8080, ()=> {
    console.log("Server started on port 8080");
});
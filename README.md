# GeoDash World
[GeoDash World](https://geodash-world-client.onrender.com/)
## Overview
This app was created for Chingu Voyage 51. It is based on an original idea where users are able to learn about a city through game activities (such as quizzes and scavenger hunts).

## Features 
GeoDash World is a MERN app, using React (front-end), NodeJs/ExpressJs(backend) and MongoDB (database).

Currently GeoDash World is only set up for one city: Lexington, KY

This project includes:
 - Ability to log in and sign up for new users with thank you emails automatically being sent
 - A profile page where username and profile picture can be changed with a summary of points and badges earned
 - An achievements page where users can see all available badges and the ability to share them on social media
 - On home page, users are able to plan routes to get from one destination to another. 
 - Incorporate GPS monitoring during scavenger hunt to verify user location
 - Dedicated Quiz page where users can answer questions within a time limit
 - Real-time score updates for quiz and scavenger hunt challenges on leaderboard ranking

## How to Start
To run this project, first clone this project locally. This project has a client (front-end) and server (back-end) folder.

**Client**
Start by entering the client folder `cd client` and then run `npm install`. To run the app, run `npm run dev`

**Server**
Start by entering the server folder `cd server` and then run `npm install`. To run the server, could either run 1. `npm run dev` which uses nodemon - server is restart with every changes to server file 2. `npm run start` uses node - will need to restart server each time for changes to be reflect.

## What is needed in .env File
For this project, each folder (client and server) will need .env file/

The client .env file will need:
    -VITE_GOOGLE_MAPS_API_KEY: googlemaps api key
<!-- 
VITE_BACKEND_URL: backend-render-url //This will only be for deployment, not necessary during development -->
The server .env file will need: 
    - NODE_ENV: development or production  //Select one. Production should only be use in deployment
    - MONGO_URI: mongodatabase URI
    - ACCESS_TOKEN_SECRET: ####  // JWT tokens
    - SENDGRID_API_KEY: ####  
<!-- VITE_FRONTEND_URI: frontend-render-url //This will only be for deployment, not necessary during development -->

## Production
This project is being hosted on Render. However due to the limitation of the free tier, there will be a delay for the backend/web service to start up. Please wait until, the yellow landmarks appear on the home page before exploring our app. 

## TEST USERS
Here are some test emails/password you can use to login bypassing the need to signup:
1. hello@gmail.com
2. royal23@outlook.com
3. kytb@aol.com
All have the same password of "testTest1!"



## Our Team
**Agile Animappers**

- Suruchi Patki: [GitHub](https://github.com/Supatki) / [LinkedIn](https://www.linkedin.com/in/suruchi-patki-b0710b195/)
- Julie Cheng: [GitHub](https://github.com/jucheng925) / [LinkedIn](https://www.linkedin.com/in/juliecheng925/)
- Cody Miller: [GitHub](https://github.com/CJMiller17) / [LinkedIn](https://www.linkedin.com/in/cjmiller17/)
- Tuyet Nguyen: [GitHub](https://github.com/hongtuyet91) / [LinkedIn](https://www.linkedin.com/in/nguyen-tuyet/)
- Rika Miyata: [GitHub](https://github.com/Tayrika) / [LinkedIn](https://www.linkedin.com/in/rika-miyata-4bab99243/)
- Mahyar Erfanian: [GitHub](https://github.com/Mahyar-98) / [LinkedIn](https://www.linkedin.com/in/mahyar-erfanian-67968279/)
- Greimil Nunez: [GitHub](https://github.com/Greimil) / [LinkedIn](https://www.linkedin.com/in/greimil-nu%C3%B1ez/)

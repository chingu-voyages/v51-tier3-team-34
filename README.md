# GeoWorld Dash
## Overview
This app was created for Chingu Voyage 51. It is based on an original idea where users are able to learn about a city through game activities (such as quizzes and scavenger hunts).

## Features 
Currently GeoDash World is only set up for one city: Lexington, KY

This project includes:
 - Ability to log in and sign up for new users with thank you emails automatically being sent
 - A profile page where username and profile picture can be change with a summary of points and badges earned
 - An achievements page where users can see all available badges and the ability to share them on social media
 - On home page, users are able to plan routes to get to one destination to another. 
 - Incorporate GPS monitoring during scavenger hunt to verify user location
 - Dedicated Quiz page where users can answer questions within a time limit

## How to Start
To run this project locally, first clone this project locally.

**Client (front-end)**
Go into client folder, run `npm install`. Make sure there is an .env file in client folder with your google maps api key. To run `npm run dev`

**Server (back-end)**
Go into server folder, run `npm install`. Make sure there is an .env file in server folder with you mongodb username/password. To run server: 1. `npm run dev` using nodemon - changes to server file will restart server each time 2. `npm run start` using node - will need to restart server each time for change to be reflect

## What to put on ENV.files
**Client (using vite)**

VITE_GOOGLE_MAPS_API_KEY: googlemaps api key

VITE_BACKEND_URL: backend-render-url //This will only be for deployment, not necessary during development

**Server**

NODE_ENV: development or production  //Select one. Production should only be use in deployment

MONGO_URI: mongodb+srv://<db_username>:<db_password>@geoworlddash.zosfj.mongodb.net/geoworlddash?retryWrites=true&w=majority&appName=geoworlddash       __replace db_username and db_password with what was sent to you__

VITE_FRONTEND_URI: frontend-render-url //This will only be for deployment, not necessary during development

ACCESS_TOKEN_SECRET: ####

SENDGRID_API_KEY: ####

..
## TEST USERS
Here are some test emails/password you can use to login without needing to signup:
1. hello@gmail.com
2. royal23@outlook.com
3. kytb@aol.com
All have the same password of "testTest1!"

## Team Documents

You may find these helpful as you work together to organize your project.

- [Team Project Ideas](./docs/team_project_ideas.md)
- [Team Decision Log](./docs/team_decision_log.md)

Meeting Agenda templates (located in the `/docs` directory in this repo):

- Meeting - Voyage Kickoff --> ./docs/meeting-voyage_kickoff.docx
- Meeting - App Vision & Feature Planning --> ./docs/meeting-vision_and_feature_planning.docx
- Meeting - Sprint Retrospective, Review, and Planning --> ./docs/meeting-sprint_retrospective_review_and_planning.docx
- Meeting - Sprint Open Topic Session --> ./docs/meeting-sprint_open_topic_session.docx

## Our Team

Everyone on your team should add their name along with a link to their GitHub
& optionally their LinkedIn profiles below. Do this in Sprint #1 to validate
your repo access and to practice PR'ing with your team *before* you start
coding!

- Suruchi Patki: [GitHub](https://github.com/Supatki) / [LinkedIn](https://www.linkedin.com/in/suruchi-patki-b0710b195/)
- Julie Cheng: [GitHub](https://github.com/jucheng925) / [LinkedIn](https://www.linkedin.com/in/juliecheng925/)
- Cody Miller: [GitHub](https://github.com/CJMiller17) / [LinkedIn](https://www.linkedin.com/in/cjmiller17/)
- Tuyet Nguyen: [GitHub](https://github.com/hongtuyet91) / [LinkedIn](https://www.linkedin.com/in/nguyen-tuyet/)
- Rika Miyata: [GitHub](https://github.com/Tayrika) / [LinkedIn](https://www.linkedin.com/in/rika-miyata-4bab99243/)
- Mahyar Erfanian: [GitHub](https://github.com/Mahyar-98) / [LinkedIn](https://www.linkedin.com/in/mahyar-erfanian-67968279/)
- Greimil Nunez: [GitHub](https://github.com/Greimil) / [LinkedIn](https://www.linkedin.com/in/greimil-nu%C3%B1ez/)

## Setup

    npm i

Before running anything locally, create a `.env` file and initialize your env variable like so:

    DB=mongodb://localhost:27017/boilerplate
    SECRET_KEY=NSA
    REACT_APP_URL=http://localhost:3000 // when cors is enabled, this will be the only origin to send requests

PS: if you're deploying to a VPS/VPC u should have another `.env.production` file and add some logic to handle that on the `./config/config.js` file.

Start the db locally

    npm run database

PS: replace `mongo-data` with the name of the folder your data is stored.

start dev server

    npm run dev

start prod server

    npm start

## Models

User

- firstName
- lastName
- username
- email
- password
- tokens

Profile

- user
- type
- handle
- date

Post

- title
- description
- date
- _creator

## Routes

- User

        POST /api/user/register
        // Register a new user and returns user data with the generated token
        // Public

        POST /api/user/login
        // Login user and returns user data with the generated token
        // Public

        GET /api/user/verify
        // Verifies token and returns current user data
        // Private

        DELETE /api/user/logout
        // Logout
        // Private

- Profile

        GET /api/profile
        // GET current user profile
        // Private

        POST /api/profile
        // create or Edit user profile
        // Private

        DELETE /api/profile
        // Delete user and profile
        // Private

        GET /api/profile/all // Not available yet
        // Get all profiles

        GET /api/profile/handle/:handle // Not available yet
        // Get profile by handle

- Post

        POST /api/post
        // Create a new post
        // Private

        GET /api/post/all
        // Get all the posts

        GET /api/post/:id
        // Get Post by ID
        // Private

        DELETE /api/post/:id
        // Delete Post by ID
        // Private

        PATCH /api/post/:id
        // Update a post
        // Private

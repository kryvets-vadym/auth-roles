# Authentication Roles Sample

This sample project demonstrates how to set up a user authentication API with using JSON Web Tokens. There are several endpoints exposed in the sample, including user login and signup, along with an example of a protected `users` resource.

## Installation and Running the App

Clone the repo, then:

```bash
npm install
npm run dev
```

The app will be served at `localhost:5000`.

## Local Setup

To setup the API locally, you can use the test data provided in the `.env` file or you will need to run MongoDB. Create a `.env` file and populate it with the following values:

```bash
DB_URL=<database_connection_url>
JWT_ACCESS_SECRET=<access_secret_key>
JWT_REFRESH_SECRET=<refresh_secret_key>

SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USER=<smtp_user_email>
SMTP_PASSWORD=<smtp_user_password>
```

## Available Routes

#### **POST** `/api/registration`
* Used for signing up a user. Accepts `username`, `email`, `password`, 
`role` (optional, default: `USER`) and `boss` (optional, boss 'id' for current user) to create a user. 
* If we specify the boss parameter, the role is changed to `BOSS` in the user with 
the corresponding id, and the id of the current user is added to the subordinate array.
* Returns a `accessToken`, `refreshToken` and `user data`.

#### **POST** `/api/login`
* Used for logging a user in. Accepts `email` and `password` to authenticate a user. 
* Returns a `accessToken`, `refreshToken` and `user data`.

#### **GET** `/api/activate/:link`
* A link of this type is emailed to the user. When the users click this link, 
they confirm their email and successfully register with the app. The `:link` is generated using the `uuid` library.

#### **POST** `/api/logout`
* Used for logout a user.

#### **GET** `/api/refresh`
* Here the tokens may have a validity period so after the period the `token` expires 
and the user has to again generate the `token` as in login again but with the help of 
`refresh token`, we can regenerate the `accessToken` using `refreshToken` without actually
logging in.

#### **GET** `/api/users`
* Returns all users in the database. Requires a valid JWT with an `ADMIN` role.
* Returns current user in the database. Requires a valid JWT with an `USER` role.
* Returns current user and his subordinates in the database. Requires a valid 
JWT with an `BOSS` role.

# Enhanced Authentication System with Profile Visibility

## Overview

This project enhances an existing backend API for an authentication system to include a new feature allowing users to set their profiles as public or private. Additionally, it implements functionality to allow admin users to view both public and private user profiles, while normal users can only access public profiles. The project is built using Node.js and Express.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication and Authorization](#authentication-and-authorization)
- [Contribution](#contribution)
- [License](#license)

## Installation

- To install the dependency run `npm install` in project folder
- To run the application run following command after installing dependency `npm run dev`

The endpoint that backend would run on would be `http://localhost:3000/`
## Endpoints
On register and login cookie is set with access_token cookie name
- Register new user(POST): `http://localhost:3000/auth/register`,
        body(JSON): {
            "name": "admin",
            "email": "admin@gmail.com",
            "password": "mypassword",
            "isPublic": false,
            "isAdmin": true
        }
- Login user(POST): `http://localhost:3000/auth/login`,
        body(JSON): {
            "email": "admin@gmail.com",
            "password": "mypassword"
        }
- Logout user(GET): `http://localhost:3000/auth/logout`,
- Login/Register using google(GET): `http://localhost:3000/auth/google/`,: This will give a URL link for registeration using google you can visit its link
to register.
## Following are protected routes
- Get current loggedin user data(GET): `http://localhost:3000/userData`,
- Get all users(GET): `http://localhost:3000/users`,
- Set user data(PATCH): `http://localhost:3000/userData`,
    body(form data): {
            "photo": File or string,
            "bio": "bio",
            "name": "name",
            "phone": "phone",
            "email": "email",
            "password": "new password",
        }

### Prerequisites

- Node.js
- npm

### Steps

1. Clone the repository:

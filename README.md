# SubLedger API

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/bcrypt-4A90E2?style=for-the-badge" alt="bcrypt" />
</p>



## Features & Operations

### Authentication

* Register account
* Login with JWT
* Password hashing with bcrypt

### Subscription Management

* Create subscription
* Get all subscriptions
* Get one subscription
* Update subscription
* Delete subscription
* Cancel subscription

### Transaction Management

* Create transaction
* Get subscription transactions
* Calculate total spent per subscription
* Prevent transactions on cancelled subscriptions

### Admin Operations

* View all users
* View user profile
* View all transactions
* Get global spending overview

### Extra Features

*filtering by any field
* Role and ownership middleware

## API Format

All responses are returned in **JSON** with appropriate HTTP status codes.

## UML

* Use Case Diagram
* Class Diagram
* Sequence Diagram

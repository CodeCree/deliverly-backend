# Deliverly API
A [CodeCree](https://www.codecree.co.uk) project as part of the [Knightshield Hackathon](https://knightshieldservice.github.io/knightshieldhackathon.github.io/)

> **Briefing:** Create an app of any kind that utilizes the latest technolgy and has an innovative way of tracking packages and shipping!

Endpoint is localhost:3000/api
The endpoint will **only** receive and send data in JSON formatting

## GET /ping
Checks to see if the api is online
#### Expected reply
```json
{
    "success": true,
    "message": "Online"
}
```

## POST /user/register
Registers a new user into a database
##### Example json body
```json
{
    "email": "test@codecree.co.uk",
    "password": "password",
    "terms": true
}
```

#### Expected reply
```json
{
    "success": true
}
```

#### Error example
In this example, the password doesn't meet the requirement if being at least 8 letters long
```json
{
    "success": false,
    "error": "\"password\" length must be at least 8 characters long"
}
```

## POST /user/login
Logs a user in if the account exists on the database
#### Example json body
```json
{
    "email": "test@codecree.co.uk",
    "password": "password"
}
```

#### Expected reply
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjIxZjI3Yjk5MWU0NjUwOTQwZWFiMDkiLCJpYXQiOjE1OTYwNjIxNjJ9.t9C17-Sf_fIgNGy_PtlcHxRuqOPpaGbj8YJGKfCs-Pc"
}
```

#### Error example
In this example, the password is wrong
```json
{
    "success": false,
    "message": "Email or password is incorrect"
}
```

## POST /package
Post a new package to the server
#### Example json body
```json
{
    "warehouse": "000001",
    "weight": "1.22",
    "recipient": "John Doe",
    "address": {
        "street": "10 Downing Street",
        "town": "Westminster",
        "city": "London",
        "postcode": "SW1A 2AA"
    }
}
```
#### Sending a premium package



#### Expected reply
```json
{
    "success": true,
    "customerCode": "symptom-beneficial-penetrate"
}
```

#### Error example
In this example, the Google Geolocate API key is invalid
```json
{
    "success": false,
    "message": "The provided API key is invalid."
}
```
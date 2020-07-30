# Deliverly API
A [CodeCree](https://www.codecree.co.uk) project as part of the [Knightshield Hackathon](https://knightshieldservice.github.io/knightshieldhackathon.github.io/)

> **Briefing:** Create an app of any kind that utilizes the latest technolgy and has an innovative way of tracking packages and shipping!

Endpoint is localhost:3000/api
The endpoint will **only** receive and send data in JSON formatting

## GET /ping
Checks to see if the api is online
**Auth type required: NONE**
#### Expected reply
```json
{
    "success": true,
    "message": "Online"
}
```

## POST /user/register
Registers a new user into a database
**Auth type required: NONE**
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
**Auth type required: EMAIL & PASSWORD**
**Auth location: JSON BODY**
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
**Auth type required: AUTH TOKEN ANY**
**Auth location: HEADER "Authorization"**
#### Example json body
```json
{
    "warehouse": "000001",
    "weight": "1.22",
    "email": "john@codecree.co.uk",
    "recipient": "John Doe",
    "address": {
        "street": "10 Downing Street",
        "city": "London",
        "postcode": "SW1A 2AA"
    }
}
```
#### Sending a premium package
```json
{
    "recipient": "John Doe",
    "email": "john@codecree.co.uk",
    "address": {
        "street": "10 Downing Street",
        "town": "Westminster",
        "city": "London",
        "postcode": "SW1A 2AA"
    },
    "collect": {
        "street": "Buckingham Palace",
        "town": "Westminster",
        "city": "London",
        "postcode": "SW1A 1AA"
    },
    "premium": "1596139634268"
}
```


#### Expected reply
```json
{
    "success": true,
    "customerCode": "historian-broach-courtesan",
    "id": "5f2328b11d4da55e54991276"
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

## GET /package/{code}
Get package information
**Auth type required: AUTH TOKEN ANY**
**Auth location: HEADER "Authorization"**

#### Example request
`GET localhost:3000/api/package/stop-amble-oviparous`

#### Expected reply
```json
{
    "success": true,
    "data": {
        "code": "stop-amble-oviparous",
        "weight": 1.22,
        "recipient": "John Doe",
        "email": "john@codecree.co.uk",
        "address": {
            "coordinates": [
                51.5034,
                -0.1276
            ],
            "_id": "5f234d15f9424b3c403e23ab",
            "street": "10 Downing Street",
            "city": "London",
            "postcode": "SW1A 2AA"
        },
        "events": []
    }
}
```

#### Error example
In this example, the package does not exist
```json
{
    "success": false,
    "message": "Package does not exist"
}
```

## POST /warehouse
Create a new warehouse
**Auth type required: AUTH TOKEN OPERATOR ONLY**
**Auth location: HEADER "Authorization"**

#### Example request
```json
{
    "name": "Warehouse Bravo Mark 2",
    "address": {
        "street": "14 Downing Street",
        "city": "London",
        "postcode": "SW1A 2AA"
    }
}
```

#### Expected reply
```json
{
    "success": true,
    "id": "269bda92-d98b-4a8c-a1ed-6d5f658831b5"
}
```

#### Error example
In this example, the header has an invalid token
```json
{
    "success": false,
    "message": "Invalid token"
}
```


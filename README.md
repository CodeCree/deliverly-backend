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

## GET /qr-code
Checks to see if the api is online  
**Auth type required: NONE**
#### Expected reply
```json
{
    "success": true,
    "data": [
        "2d946ef3-9c4d-4229-aaea-5cf54b1e1727",
        "13c58d87-809f-4ce5-b70b-4a32356c68c4",
        "bd1e27c6-8bdc-43c9-a522-79e49f055793",
        "and 12 more of these"
    ]
}
```

## POST /user/register
Registers a new user into a database  
**Auth type required: AUTH TOKEN OPERATOR ONLY**  
**Auth location: HEADER "Authorization"**
##### Example json body
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "test@codecree.co.uk",
    "password": "password"
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
    "email": "op@codecree.co.uk",
    "operator": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjIyMDgxYTI3MDllZDIzYjgzYWJhMmUiLCJvcGVyYXRvciI6dHJ1ZSwiaWF0IjoxNTk2MTQ4ODc3fQ.vgDnt0WkbBbEZrP5YNZTgWuqNg4ycZIIJFRXQApLBi0"
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

## GET /me
Checks to make sure a user is logged in  
**Auth type required: AUTH TOKEN ANY**  
**Auth location: HEADER "Authorization"**

#### Example request
`GET localhost:3000/api/user/me`

#### Example reply
```json
{
    "success": true,
    "data": {
        "email": "op@codecree.co.uk",
        "operator": true
    }
}
```

#### Error example
In this example, the token is invalid
```json
{
    "success": false,
    "message": "Invalid token"
}
```

## GET /user
Gets a list of all none operator users  
**Auth type required: AUTH TOKEN OPERATOR ONLY**  
**Auth location: HEADER "Authorization"**

#### Example request
`localhost:3000/api/user`

#### Expected reply
```json
{
    "success": true,
    "data": [
        {
            "operator": false,
            "_id": "5f23f6cbf0e0e028c074588d",
            "firstName": "John",
            "lastName": "Doe",
            "email": "johndoe@codecree.co.uk"
        },
        {
            "operator": false,
            "_id": "5f240ad1b058dd2fdb194e30",
            "firstName": "Romeo",
            "lastName": "Montague",
            "email": "romeo@codecree.co.uk"
        }
    ]
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
The *data* is the new list of warehouses
```json
{
    "success": true,
    "id": "269bda92-d98b-4a8c-a1ed-6d5f658831b5",
    "data": [
        {
            "_id": "5f2343f6966c154de8f3e7a0",
            "uuid": "d1a0654d-bc5d-44d2-b3f0-d8df10d8d62b",
            "name": "Warehouse Bravo Mark 2",
            "address": {
                "coordinates": [
                    51.5032,
                    -0.1281
                ],
                "_id": "5f2343f6966c154de8f3e79f",
                "street": "14 Downing Street",
                "city": "London",
                "postcode": "SW1A 2AA"
            },
            "__v": 0
        }
    ]
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

## GET /warehouses
Get all the warehouse information  
**Auth type required: AUTH TOKEN ANY**  
**Auth location: HEADER "Authorization"**

#### Example request
`GET localhost:3000/api/warehouses`

#### Expected Reply
```json
{
    "success": true,
    "data": [
        {
            "_id": "5f2343f6966c154de8f3e7a0",
            "uuid": "d1a0654d-bc5d-44d2-b3f0-d8df10d8d62b",
            "name": "Warehouse Bravo Mark 2",
            "address": {
                "coordinates": [
                    51.5032,
                    -0.1281
                ],
                "_id": "5f2343f6966c154de8f3e79f",
                "street": "14 Downing Street",
                "city": "London",
                "postcode": "SW1A 2AA"
            },
            "__v": 0
        },
        {
            "_id": "5f234d87f9424b3c403e23b0",
            "uuid": "269bda92-d98b-4a8c-a1ed-6d5f658831b5",
            "name": "Amazing warehouse v3",
            "address": {
                "coordinates": [
                    51.5032,
                    -0.1281
                ],
                "_id": "5f234d87f9424b3c403e23af",
                "street": "14 Downing Street",
                "city": "London",
                "postcode": "SW1A 2AA"
            },
            "__v": 0
        }
    ]
}
```

## GET /warehouse/{uuid}
Get warehouse information  
**Auth type required: AUTH TOKEN ANY**  
**Auth location: HEADER "Authorization"**

#### Example request
`GET localhost:3000/api/warehouse/d1a0654d-bc5d-44d2-b3f0-d8df10d8d62b`

#### Expected reply
```json
{
    "success": true,
    "data": {
        "uuid": "d1a0654d-bc5d-44d2-b3f0-d8df10d8d62b",
        "name": "Warehouse Bravo Mark 2",
        "address": {
            "coordinates": [
                51.5032,
                -0.1281
            ],
            "_id": "5f2343f6966c154de8f3e79f",
            "street": "14 Downing Street",
            "city": "London",
            "postcode": "SW1A 2AA"
        }
    }
}
```
#### Error example
In this example, the warehouse does not exist on the database
```json
{
    "success": false,
    "message": "Warehouse does not exist"
}
```

## POST /route
Creates a new route  
**Auth type required: AUTH TOKEN ANY**  
**Auth location: HEADER "Authorization"**

#### Example request
```json
{
    "endWarehouse": "d1a0654d-bc5d-44d2-b3f0-d8df10d8d62b"
}
```

#### Expected reply
```json
{
    "success": true
}
```

#### Error example
In this example, the warehouse does not exist
```json
{
    "success": false,
    "error": "Warehouse does not exist"
}
```

## GET /routes/all
Gets all routes   
**Auth type required: AUTH TOKEN OPERATOR ONLY**  
**Auth location: HEADER "Authorization"**

#### Example request
`GET localhost:3000/api/routes/all`

#### Expected Reply
```json
{
    "success": true,
    "data": [
        {
            "startedAt": null,
            "endedAt": null,
            "_id": "5f2379ad1eebe0cb2f59321a",
            "userId": "5f22081a2709ed23b83aba2e",
            "endWarehouse": "d1a0654d-bc5d-44d2-b3f0-d8df10d8d62b",
            "packages": [],
            "tracking": [],
            "__v": 0
        },
        {
            "startedAt": null,
            "endedAt": null,
            "_id": "5f23f5fe9ac57ec0e71e4dc0",
            "userId": "5f22081a2709ed23b83aba2e",
            "endWarehouse": "269bda92-d98b-4a8c-a1ed-6d5f658831b5",
            "packages": [],
            "tracking": [],
            "__v": 0
        }
    ]
}
```

## GET /routes
Gets all route info for current user
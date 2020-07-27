# Deliverly Backend API
Endpoint is localhost:3000
The API returns and receives **JSON ONLY**

## Database Config Setup
The database can be found in [db.example.js](./config/db.example.js)
```JavaScript
module.exports = {
    url: "mongodb+srv://<username>:<password>@<your-cluster-url>/<database>?retryWrites=true&w=majority"
}
```
Where:
- Username is your username
- Password is your password
- Cluster is your url (example cluster.xxxxx.mongodb.net)
- Database is your selected database

## GET /api/ping
Returns: "Online"

```json
{ 
	success: true,
	status: "Online"
}
```

Sample call:
`GET localhost:3000/api/ping`

## GET /api/package/{packageid}
Returns package information

```json
{
	sucess: true;
	data: {
		weight: 1.00,
		location: {
			latitude: 0.00,
			longitude: 0.00
		}
	}
}
```

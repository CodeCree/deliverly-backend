const axios = require("axios");

// Loads environment variables
const dotenv = require("dotenv");
dotenv.config();

module.exports = async function (address) {
    var data = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GEO_KEY}`).then((res) => {
        return res.data;
        //console.log(res.data.results[0].geometry.location);
    })
    return data;
}

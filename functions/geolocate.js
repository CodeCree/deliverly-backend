const axios = require("axios");

// Loads environment variables
const dotenv = require("dotenv");
dotenv.config();

module.exports = async function (address) {
    var data = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GEO_KEY}&region=uk`).then((res) => {
        if (res.data.status != 'OK') return null;
        if (!res.data.results.length === 0) return null;
        if (res.data.results[0].partial_match) return null;

        try {
            let lat = res.data.results[0].geometry.location.lat.toFixed(4);
            let long = res.data.results[0].geometry.location.lng.toFixed(4);

            return [lat, long];
        }
        catch (error) {
            return null;
        }
        
        
    })
    return data;
}

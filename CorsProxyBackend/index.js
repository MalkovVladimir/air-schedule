var express = require("express");
var app = express();
var https = require('https');

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.post("/url", (req, res, next) => {

    console.log(req.query)

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

    https.get('https://api.flightstats.com' + 
        '/flex/flightstatus/rest/v2/json/airport/status/' +
        `${req.query.arrivalAirportCode}` + 
        `/${req.query.isArrive == 'true' ? 'arr' : 'dep'}` + 
        `/${req.query.year}/${req.query.month}/${req.query.day}` +
        `/${req.query.hourOfDay}?appId=4e6e22ed&appKey=84e0e5775586e5b18c5de421ffe0fa3e`,
        (resp) => {

            var data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log('END');
                res.json(data);
            });

        }).on("error", (err) => {
            res.json(`{ "apiError": "${err.message}" }`);
            console.log("Error: " + err.message);
        });
});
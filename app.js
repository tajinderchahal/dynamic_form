var express = require("express");
var app = express();
var https = require('https');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var getDataFromApi = function(url, res) {
  var req = https.get(url, function(api_res) {
    var data = [];

    api_res.on('data', function(chunk) {
        data.push(chunk);
    }).on('end', function() {
        var buffer = Buffer.concat(data);
        res.send(JSON.parse(buffer.toString('utf8')));
    });
  });

}

var token = "720106c7a6217516f9ed110fd31a5fca"

app.get("/api/v1/form", (req, res, next) => {
  var formId = req.query.id;
  var formUrl = "https://www.formstack.com/api/v2/form/" + formId + ".json?oauth_token=" + token;
  getDataFromApi(formUrl, res);
});


app.get("/api/v1/data", (req, res, next) => {
  var submission_id = req.query.id;
  var dataUrl = "https://www.formstack.com/api/v2/submission/" + submission_id + ".json?oauth_token=" + token;
  getDataFromApi(dataUrl, res);
});

app.listen(5000, () => {
 console.log("Server running on port 5000");
});

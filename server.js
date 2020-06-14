// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
var server = app.listen(process.env.PORT || 25565);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
  response.sendFile(__dirname + "/public/styles.css");
});

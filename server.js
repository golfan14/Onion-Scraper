var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// var db = require("./models");

var PORT = 3000;

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/Scraper");


app.get("/scrape", function (req, res) {
    axios.get("http://politics.theonion.com").then(function (response) {
        var $ = cheerio.load(response.data);

        $("h1.headline").each(function (i, element) {
            var result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            db.Scraper.create(result)
                .then(function (dbScraper) {
                    console.log(dbScraper);
                    return res.json(dbScraper);
                })
                .catch(function (err) {
                    return res.json(err);
                });
            });    
        });
        res.send("Scrape Complete");
    });

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
    });    
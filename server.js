var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = 3000;

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/Scraper");


app.get("/", function (req, res) {
    db.Article.find({}, function (error, data) {
        if (error) {
            console.log(error);
        }
        else {
            res.render("index", { Article: data });
        }
    });
});

app.get("/scrape", function (req, res) {
    axios.get("http://politics.theonion.com").then(function (response) {
        var $ = cheerio.load(response.data);

        $("h1.headline").each(function (i, element) {
            var result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");
            console.log(result.title);
            console.log(result.link);
            console.log("==================");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                    return res.json(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
    });
    res.send("Scrape Complete");
});

app.get("/articles", function(req, res) {
    db.Article.find({}, function(err, found) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(found);
        }
    })
})

app.post("/submit", function(req, res) {
    // Create a new user using req.body
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // If saved successfully, send the the new User document to the client
        res.json(dbComment);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });
  });


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});    
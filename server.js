var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var morgan = require("morgan");


var db = require("./models");

var PORT = 3000;

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(morgan("dev"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/Scraper");


app.get("/", function (req, res) {
    db.Article.find().populate("comment").exec(function (error, data) {
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
    res.redirect("/");
});

app.post("/submit", function(req, res) {
    // Create a new Book in the database
    db.Comment.create(req.body)
      .then(function(dbComment) {
        return db.Article.findOneAndUpdate({}, { $push: { comment: dbComment._id } }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });



    




app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});    
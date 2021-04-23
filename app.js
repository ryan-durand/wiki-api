const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////Requets targeting all articles

app.route("/articles")
//GET All Articles
.get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      //console.log(foundArticles);
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
//POST - creates one new article *currently through postman: localhost:3000/articles*
.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if (!err) {
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})
//DELETE all articles
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

///////////////Requests targeting one article
app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title found.");
    }
  });
})
//updates article but makes other field null if not filled out
.put(function(req, res){
  Article.update(
    //find
    {title: req.params.articleTitle},
    //update title+content
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the content of the article.");
      } else {
        res.send(err);
      }
    }
  );
})
//updates article and doesnt set other fields to null
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  )
})
.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the article.");
      } else {
        res.send(err);
      }
    }
  )
});

app.get("/", function(req, res) {
  res.send("Server is up and running.");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});

const express = require("express");

const ejs = require("ejs");
const app = express();
app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jsdom = require('jsdom');
const jQuery = require('jquery')(new jsdom.JSDOM().window);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb+srv://admin-sheni:gracias80@cluster0.kp58k.mongodb.net/calculatorDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema={
  expression: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  expression: "9*9 = 81"
});

const item2 = new Item({
  expression: "Hit the checkbox to delete"
});
 const history = [item1, item2];


 const result = "";


app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0){
      Item.insertMany(item2, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Success!");
        }
      });
      res.redirect("/");
    }else{
      res.render("home",{result: result, history: foundItems});
    }


  });



});

app.post("/", function(req, res) {


const r = req.body.question;



try {
  eval( r );        /* Code test */
} catch (e) {
  if (e instanceof SyntaxError) {
    res.redirect("/");
  }
} finally {
  if(r){
    const s = eval(r);
    const item = new Item({
      expression: r + " = " + s
    });
    item.save(function(err){
      if (!err){
        history.push(item);
        Item.find({}, function(err, foundItems){
          if (foundItems.length === 0){
            Item.insertMany(history, function(err){
              if(err){
                console.log(err);


              }else{
                console.log("Success!");
              }
            });
            res.render("home", {result: result, history: foundItems});
          }else{
            res.render("home",{result: r + " = " + s, history: foundItems});
          }
        });
      }
    });

  }
}


});


app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      res.redirect("/");
    }
  })
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Sever Started Successfully");
});

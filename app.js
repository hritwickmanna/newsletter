const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended :true}));

//for the css and app logo not to be static under public folder
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  //member mailchimp will verify/use
  const data ={
    members : [ //array
      {
      email_address : email,
      status : "subscribed",
      merge_fields :  {
        FNAME : firstName,
        LNAME : lastName
        }
      }
    ]
  };
  //stringify the data
  const jsonData = JSON.stringify(data);

  // made request
  const request =https.request(url, options, function(response){
    response.on("data", function(data){ //searching for any data
      console.log(JSON.parse(data));
    })
    if(response.statusCode == 200){
      res.sendFile(__dirname +"/sucess.html");
    }else{
      res.sendFile(__dirname +"/failure.html");
    }
  })
  //save request of the user data and pass to mailchimp server
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
  // res.sendFile(__dirname + "/signup.html");
  res.redirect("/");
})
//api key
// 15cc26598692398b58f707eb59439082-us7
//list id
// eef2627423
app.listen(process.env.PORT || 3000, function(){//process.env.PORT is for heroku server terminal
  console.log("Port 3000 started working");
})

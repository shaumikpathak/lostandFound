const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const sql = require("sqlite3").verbose();
const request = require("request");
const FormData = require("form-data");

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/images");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

let upload = multer({ storage: storage });

let filename1 = "";

app.use("/images", express.static("images"));

const expressSession = require("express-session");
app.use(
  expressSession({
    secret: Math.random()
      .toString(36)
      .substring(2, 15),
    maxAge: 6 * 60 * 60 * 1000,
    resave: true,
    saveUninitialized: false,
    name: "final-loving-guava-cookie"
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://final-loving-guava.glitch.me/auth/accepted",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: ["profile"]
    },
    (accessToken, refreshToken, profile, done) => {
      let id = 1;
      done(null, profile);
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((data, done) => {
  //console.log("serialize");
  //console.log(data);
  // done(null, user.id);
  done(null, data);
});

passport.deserializeUser((data, done) => {
  console.log(data);
  // User.findById(id, function(err, user) {
  let userData = { userData: "Data of user" };
  done(null, data);
});

app.use(express.static("public"));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/user/*", requireLogin, express.static("."));

app.get("/auth/google", checkLogin, passport.authenticate("google"));

app.get(
  "/auth/accepted",
  passport.authenticate("google", {
    successRedirect: "/auth/success",
    failureRedirect: "/"
  })
);

app.get("/auth/success", requireUser, function(req, res) {
  // req.header or req.get
  if (
    req.header("Referrer") &&
    (req.header("Referrer").indexOf("google.com") != -1 ||
      req.header("Referrer").indexOf("youtube.com") != -1)
  ) {
    res.cookie("google-passport-cookie", new Date());
    res.redirect("/user/mainpage.html");
  } else {
    res.redirect("/");
  }
});

function requireUser(req, res, next) {
  if (!req.user) {
    res.redirect("/");
  } else {
    console.log("user is", req.user);
    res.cookie("user-data", req.user);
    next();
  }
}

function requireLogin(req, res, next) {
  console.log("checking:", req.cookies);
  if (!req.cookies["final-loving-guava-cookie"]) {
    console.log("requireLogin redirect to /");
    res.sendFile(__dirname + "/public/not_signed_in.html");
  } else {
    next();
  }
}

function checkLogin(req, res, next) {
  console.log("checking:", req.cookies);
  if (req.cookies["final-loving-guava-cookie"]) {
    res.redirect("/user/mainpage.html");
  } else {
    next();
  }
}

app.get("/logout", function(req, res) {
  // res.clearCookie('google-passport-example');
  res.clearCookie("final-loving-guava-cookie");
  res.redirect("/");
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.get("/getAddress", (req, res) => {
  let url =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    req.query.lat +
    ", " +
    req.query.lng +
    "&key=" +
    process.env.API_KEY;
  request(url, { json: true }, (error, response, body) => {
    if (error) {
      return console.log(error);
    }
    res.json(body);
  });
});

app.get("/searchAddress", (req, res) => {
  // LOCATION BIAS
  var url =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
    req.query.input +
    "&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&locationbias=circle:100000@38.5367859,-121.7553711&key=" +
    process.env.API_KEY;
  request(url, { json: true }, (error, response, body) => {
    if (error) {
      return console.log(error);
    }
    res.json(body);
  });
});

const stuDB = new sql.Database("LostAndFound.db");

let cmd = "SELECT name FROM sqlite_master WHERE type='table' AND name='Lost' ";
stuDB.get(cmd, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("No database file - creating one");
    createDB();
  } else {
    console.log("Database file found");
  }
});

function createDB() {
  // explicitly declaring the rowIdNum protects rowids from changing if the
  // table is compacted; not an issue here, but good practice
  const cmd =
    "CREATE TABLE Lost (rowId INTEGER PRIMARY KEY UNIQUE, lostfound TEXT, title TEXT, category TEXT, description TEXT, photoURL TEXT, date DATE, time TEXT, location TEXT)";
  stuDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure", err.message);
    } else {
      console.log("Created database");
    }
  });
}

app.use(bodyParser.json());

// gets JSON data into req.body
app.use(express.static("public"));

app.post("/found", function(request, response) {
  let title = request.body.title;
  let category = request.body.category;
  let description = request.body.description;
  //let photo = request.body.photo;
  let photo = "";
  let date = request.body.date;
  let time = request.body.time;
  // let location = request.body.location;
  let location = "";
  //

  let found = "found";
  // console.log(RandList);
  const cmd =
    "INSERT INTO Lost (lostfound, title, category, description, date, time, location) VALUES (?,?,?,?,?,?,?) ";
  //delete comma after err
  stuDB.run(
    cmd,
    found,
    title,
    category,
    description,
    date,
    time,
    location,
    function(err, val) {
      if (err) {
        console.log("DB insert error", err.message);
        //next();
      } else {
        // the rowid of last inserted item
        // response.send("Got new item, inserted with rowID: "+newId);
        console.log("sucess");
      }
    }
  );
  response.send(this.lastID);
});

// gets JSON data into req.body
app.post("/lost", function(request, response) {
  let title = request.body.title;
  let category = request.body.category;
  let description = request.body.description;
  //let photo = request.body.photo;
  let photo = "";
  let date = request.body.date;
  let time = request.body.time;
  //let location = request.body.location;
  let location = "";

  let lost = "lost";
  // console.log(RandList);
  const cmd =
    "INSERT INTO Lost (lostfound, title, category, description, date, time, location) VALUES (?,?,?,?,?,?,?) ";
  //delete comma after err
  stuDB.run(
    cmd,
    lost,
    title,
    category,
    description,
    date,
    time,
    location,
    function(err, val) {
      if (err) {
        console.log("DB insert error", err.message);
        //next();
      } else {
        // the rowid of last inserted item
        // response.send("Got new item, inserted with rowID: "+newId);
        console.log("success");
      }
    }
  );
  response.send(this.lastID);
});

app.post("/search", function(request, response) {
  console.log("Server reveived", request.body);
  let info = request.body;
  let dateFrom = info.dateFrom;
  let timeFrom = info.timFrom;
  let dateTo = info.dateTo;
  let timeTo = info.timeTo;
  let cat = info.category;
  let title = info.title;
  //SELECT * FROM Lost WHERE date BETWEEN ? AND ? AND time BETWEEN ? AND ? UNION
  //SELECT * FROM Lost WHERE category=?
  //dateFrom, dateTo,timeFrom, timeTo,
  //dateFrom, dateTo,timeFrom, timeTo, cat,
  //SELECT * FROM Lost WHERE date BETWEEN ? AND ? AND time BETWEEN ? AND ? UNION SELECT * FROM Lost WHERE category=? UNION

  const cmd ="SELECT * FROM Lost WHERE date BETWEEN ? AND ? AND time BETWEEN ? AND ? OR category=? OR title=? ";
  //const cmd = "SELECT title FROM Lost" ;
  //const cmd="SELECT * FROM Lost WHERE lostfound='found'";
  stuDB.all(cmd, dateFrom, dateTo, timeFrom, timeTo, cat, title, function(
    err,
    allRows
  ) {
    if (err) {
      console.log("DB select error", err.message);
    } else {
      console.log("success");
      console.log("This is the value: " + JSON.stringify(allRows));
      response.send(allRows);
    }
  });

  //console.log("this is the value2:" + JSON.stringify(x));
});

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/index.html");
  response.sendFile(__dirname + "/mainpage.html");
  response.sendFile(__dirname + "/screen3.html");
  response.sendFile(__dirname + "/screen4.html");
  response.sendFile(__dirname + "/screen5.html");
  response.sendFile(__dirname + "/screen6.html");
  response.sendFile(__dirname + "/screen7.html");
  response.sendFile(__dirname + "/screen8.html");
  response.sendFile(__dirname + "/screen9.html");
  response.sendFile(__dirname + "/screen10.html");
});

app.post("/upload", upload.single("newImage"), function(request, response) {
  console.log(
    "Recieved",
    request.file.originalname,
    request.file.size,
    "bytes"
  );
  filename1 = "/images/" + request.file.originalname;
  //let filename = '../images/' + request.file.originalname;
  //sendMediaStore(filename, request, response);
  if (request.file) {
    // file is automatically stored in /images,
    // even though we can't see it.
    // We set this up when configuring multer
    response.end("recieved " + request.file.originalname);
  } else throw "error";
});

app.get("/sendUploadToAPI", upload.single("newImage"), function(
  request,
  response
) {
  sendMediaStore(filename1, request, response);
});
///dasfa - category

function sendMediaStore(filename, serverRequest, serverResponse) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    serverResponse.status(400);
    serverResponse.send("No API key provided");
  } else {
    // we'll send the image from the server in a FormData object
    let form = new FormData();

    // we can stick other stuff in there too, like the apiKey
    form.append("apiKey", apiKey);
    // stick the image into the formdata object
    form.append("storeImage", fs.createReadStream(__dirname + filename));
    // and send it off to this URL
    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(
      err,
      APIres
    ) {
      // did we get a response from the API server at all?
      if (APIres) {
        // OK we did
        console.log("API response status", APIres.statusCode);
        // the body arrives in chunks - how gruesome!
        // this is the kind stream handling that the body-parser
        // module handles for us in Express.
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
          // now we have the whole body
          if (APIres.statusCode != 200) {
            serverResponse.status(400); // bad request
            serverResponse.send(" Media server says: " + body);
          } else {
            serverResponse.status(200);
            //serverResponse.send(body);
            console.log(body);
          }
        });
      } else {
        // didn't get APIres at all
        serverResponse.status(500); // internal server error
        serverResponse.send("Media server seems to be down.");
      }
    });
  }
}

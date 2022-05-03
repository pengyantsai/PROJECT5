const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { name, email, password } = req.body;
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  const hash = await bcrypt.hash(password, 10);
  password = hash;
  let newUser = new User({ name, email, password });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "User saved",
      savedObj: savedUser,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

module.exports = router;

/*      
    <br />
    <br />
    <br />
    <% if (posts.length > 0) { %> <% for (let i = 0; i < posts.length; i++) { %>
    <div class="card" style="width: 18rem">
      <div class="card-body">
        <h5 class="card-title"><%= posts[i].title %></h5>
        <p class="card-text"><%= posts[i].content %></p>
        <a href="#" class="btn btn-primary"><%= posts[i].date %> </a>
      </div>
    </div>
    <% } %> <% } %>
  </body>
  */

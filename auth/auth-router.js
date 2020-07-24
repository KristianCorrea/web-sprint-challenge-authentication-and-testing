const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require('express').Router();

const Users = require("../users/users-model")
const { isValid } = require("../auth/auth-service");

router.post('/register', (req, res) => {
  const credentials = req.body;
  if(isValid(credentials)){
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    Users.add(credentials)
      .then(user => {
        res.status(201).json({ data: user });
      })
      .catch(error => {
        res.status(500).json({ message: error.message })
      })
  }else{
    res.status(400).json({
      message: "Please... You need to provide a username and a password. The password should be Alphanumeric. (A-Z)"
    })
  }

});

router.post('/login', (req, res) => {
  const { username, password} = req.body;

  if(isValid(req.body)) {
    Users.findBy({ username: username })
            .then(([user]) => {
                // compare the password the hash stored in the database
                console.log("user", user);
                if (user && bcryptjs.compareSync(password, user.password)) {
                    const token = createToken(user);

                    res.status(200).json({ token, message: "Welcome to our API" });
                } else {
                    res.status(401).json({ message: "Invalid credentials" });
                }
            })
            .catch(error => {
                res.status(500).json({ message: error.message });
            });
  } else {
    res.status(400).json({
      message: "Please... You need to provide a username and a password. The password should be Alphanumeric. (A-Z)"
    })
  }
});

function createToken(user) {
  const payload = {
      subject: user.id,
      username: user.username
  };
  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";
  const options = {
      expiresIn: "1d",
  };
  return jwt.sign(payload, secret, options);
}

module.exports = router;
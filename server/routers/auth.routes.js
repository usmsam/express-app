const Router = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = new Router();

router.post(
  "/register",
  [
    check("email", "Incorrect email").isEmail(),
    check("password", "Incorrect password").isLength({ min: 3, max: 12 }),
  ],
  async (req, res) => {
    try {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ message: "Incorrect request" });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exist` });
      }
      const hashPass = await bcrypt.hash(password, 8);
      const newUser = new User({ email, password: hashPass });
      await newUser.save();
      return res.json({ message: "User was created" });
    } catch (error) {
      console.log(error);
    }
  }
);
module.exports = router;

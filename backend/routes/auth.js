const express = require("express");
const router = express.Router();
const passport = require("passport");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const domain = email.split("@")[1];
      if (domain !== "mail.jiit.ac.in") {
        return done(null, false, { message: "Unauthorized domain" });
      }
      let role;
      try {
        const teacher = await Teacher.findOne({ email });
        if (teacher) {
          role = "teacher";
          profile.role = role;
          profile._id = teacher._id;
          return done(null, profile);
        }
        let student = await Student.findOne({
          enroll: profile.name.familyName,
        });
        if (!student) {
          student = new Student({
            displayName: profile.name.givenName,
            enroll: profile.name.familyName,
            semester: 5,
            batch: "F1",
          });
          await student.save();
        }
        role = "student";
        profile.role = role;
        return done(null, profile);
      } catch (error) {
        console.error("Error saving user:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL + "/tests",
    failureRedirect: "/fail",
  })
);

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  res.status(401).json({ message: "Unauthorized" });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    if (req.session) {
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("connect.sid");
      });
    }
  });
});

module.exports = router;

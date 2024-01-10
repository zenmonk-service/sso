const router = require("express").Router();
const { AthenticationController } = require('../controllers')

router.get('/', AthenticationController.getSession);
router.get('/login', AthenticationController.login);
router.post('/login', AthenticationController.doLogin);
router.get('/logout', AthenticationController.logout);










// router.get("/", (req, res) => {
//   const session = req.session;
//   const { redirectURL } = req.query;
//   if(!redirectURL) return res.redirect(302, 'back');

//   if (session && session.user) {
//     res.json({
//       msg: "Authenticated successfully! you are being redirected...",
//     });
//   } else {
//     res.redirect("/login");
//   }
// });

// router.get("/login", (req, res) => {
  // const session = req.session;
  // console.log("session: ", session);

//   res.render("login");
// });

// router.post("/login", (req, res) => {
//   const session = req.session;
//   const { username, password } = req.body;
//   session.username = username;
//   session.password = password;
//   res.send("Successfully logged in!");
// });

router.get("/session-details", (req, res) => {
  const session = req.session;
  if (session && session.username) {
    res.json({ msg: "Authenticated successfully!", session });
  } else {
    res.json({ error: "Session has been expired." });
  }
});

module.exports = router;

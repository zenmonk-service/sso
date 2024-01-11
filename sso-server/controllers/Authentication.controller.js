const { redisKeys } = require('../lib/constants');
const { GetAccessToken, verifyToken } = require("../lib/helper");
const redisService = require('../services/redisService');

exports.getSession = async (req, res) => {
  // check valid token
  const token = req.session.token;
  if (token && token.access_token) {
    const isTokenValid = verifyToken(token.access_token);
    if (isTokenValid?.valid) {
      req.session.cookie.maxAge += 1000 * 60 * 60 * 3; // Add 3 hours in milliseconds
      return res.status(200).json({ message: "Authenticated successfully!", data: token });
    }
  }
  res.status(401).json({ error: "Session has been expired." });
};

exports.login = (req, res) => {
  const { redirectURL } = req.query;
  console.log('redirectURL: ', redirectURL);
  if (!redirectURL) return res.redirect(302, "back");

  // check valid token
  const token = req.session.token;
  if (token && token.access_token) {
    const isTokenValid = verifyToken(token.access_token);
    if (isTokenValid?.valid) {
      req.session.cookie.maxAge += 1000 * 60 * 60 * 3; // Add 3 hours in milliseconds
      // return res.json({ message: "Successfully logged in!", data: token });
      return res.redirect(redirectURL);
    }
  }

  // Render login page
  res.render("login");
};

let user = {
  _id: "095be615-a8ad-4c33-8e9c-c7612fbf6c9f",
  username: 'a@gmail.com',
  password: "123",
  role: "095be615-a8ad-4c33-8e9c-c7612fbf6d4f",
}

exports.doLogin = async (req, res) => {
  const { redirectURL } = req.query;
  if (!redirectURL) return res.redirect(302, "back");
  try {
    const { username, password } = req.body;
    if (!username) throw new Error('Username is required.');
    if (!password) throw new Error('Password is required.');

    // verify username and check..
    let response = user;
    if (username !== response.username || password !== response.password) return res.status(401).json({ error: 'Unauthorized' });

    // generate token
    let token = GetAccessToken(response);
    req.session.token = token;
    if (redirectURL) return res.redirect(redirectURL);
    return res.json({ message: "Successfully logged in!", data: token });
  } catch (error) {
    console.log('error: ', error);
    return res.status(401).json({ error: "Login failed!.", data: error });
  }
};

exports.logout = (req, res) => {
  const { redirectURL } = req.query;
  req.session.destroy(err => {
    if (err) {
      return console.log(err);
    }
    res.redirect(redirectURL || process.env.MAIN_DOMIN || "/login")
  });
};

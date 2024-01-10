const { redisKeys } = require('../lib/constants');
const { GetAccessToken, verifyToken } = require("../lib/helper");
const redisService = require('../services/redisService');

exports.getSession = async(req, res) => {
  console.log('session', req.sessionID)
  const jwt = req.session.jwt;
  // console.log('getSession jwt: ', jwt, '\n', req.cookies.jwt);



  // const {authorization} = req.headers
  // const token = authorization ? authorization.split(" ")[1] : "";
  // console.log('token: ', token);
  
  // if(!token) return res.json({ isTokenValid: false, error: "No jwt found."});

  // check valid token
  const isTokenValid = verifyToken(jwt.access_token);
  if (isTokenValid?.valid) {
    req.session.cookie.maxAge += 1000 * 60 * 60 * 3; // Add 3 hours in milliseconds
    return res.json({ isTokenValid: true, message: "Authenticated successfully!" });
  }

  res.json({ isTokenValid: false, error: "Session has been expired."});
};

exports.login = (req, res) => {
  const { redirectURL } = req.query;
  if (!redirectURL) return res.redirect(302, "back");

  // check valid token
  const jwt = req.session.jwt;
  console.log('jwt: ', jwt);

  const isTokenValid = verifyToken(jwt);;
  console.log('isTokenValid: ', isTokenValid);
  if (isTokenValid?.valid) return res.redirect(redirectURL);

  res.render("login");
};

exports.doLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) throw new Error('Username is required.');
    if (!password) throw new Error('Password is required.');
    
    let existToken = await redisService.redis('hgetall', `${redisKeys.session}:${username}`);
    if(Object.keys(existToken).length) {
      const isTokenValid = await verifyToken(existToken.access_token);
      if (isTokenValid?.valid) return res.redirect('http://localhost:3000');
    }

    let token = GetAccessToken(req.body);
    req.session.jwt = token;
    // res.cookie('jwt', token, {
    //   httpOnly: true,
    // });
    // await redisService.redis('hmset', `${redisKeys.session}:${username}`,  token);

    return res.json({status: true, message: "Successfully logged in!", data: token});
  } catch(error) {
    console.log('error: ', error);
    return res.status(401).json({status: false, message: "Login fail.", data: error});
  }
};

exports.logout = (req, res) => {
  console.log("Logout...");
};

const router = require("express").Router();
const { AthenticationController } = require('../controllers')

router.get('/', AthenticationController.getSession);
router.get('/login', AthenticationController.login);
router.post('/login', AthenticationController.doLogin);
router.get('/logout', AthenticationController.logout);

module.exports = router;

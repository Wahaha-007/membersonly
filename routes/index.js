var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');
var message_controller = require('../controllers/messageController');

/* GET home page. */
router.get('/', message_controller.message_list);
router.post('/', message_controller.message_create_post);

router.get('/signup', user_controller.user_signup_get);
router.post('/signup', user_controller.user_signup_post);

router.get('/login', user_controller.user_login_get);
router.post('/login', user_controller.user_login_post);

router.get('/signout',user_controller.user_logout_get);

// POST request to delete message.
router.post('/message/:id/delete', message_controller.message_delete_post);

module.exports = router;
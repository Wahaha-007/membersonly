var async = require('async');
var User = require('../models/user');
var Message = require('../models/message');
const { body, validationResult } = require('express-validator');

// Display list of all items.
exports.message_list = function (req, res, next) {
  Message.find()
    .sort({ createdAt: 1 })
    .populate('owner')
    .exec(function (err, list_messages) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('message', { title: 'Odin Message Board', message_list: list_messages, user: req.user });
    });
};

// Save Message on POST
exports.message_create_post = [

  body('title', 'Title required').trim().isLength({ min: 1 }).escape(),
  body('text', 'Message required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.

    console.log('called');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      //res.render('vendor_form', { title: 'Create Vendor', vendor: req.body, errors: errors.array() });
      res.redirect('/');
      console.log('Error1');
      return;
    }
    else {
      // Data from form is valid.

      // Create an Author object with escaped and trimmed data.
      var message = new Message(
        {
          title: req.body.title,
          text: req.body.text,
          owner: req.user._id//'62050890a5ad1ed82ae4a70a' // Superman
        });

      console.log(req.user);
      message.save(function (err) {
        if (err) { console.log('Error2'); return next(err); }
        // Successful - redirect to new author record.
        console.log('OK');
        res.redirect('/');
      });
    }
  }
];

// Handle vendor delete on POST.
exports.message_delete_post = function (req, res, next) {

  Message.findById(req.body.messageid)
  .exec(function (err, result) {
    if (err) { return next(err); }

    //Successful, so delete

      Message.findByIdAndRemove(req.body.messageid, function deleteMessage(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.redirect('/')
      });
  });
}
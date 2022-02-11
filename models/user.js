var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        status: { type: String, required: true, enum: ['Guest', 'Regular', 'Member', 'Admin'], default: 'Guest' },
        avatar: { type: Number, required: true, default: 0 },
    }, { timestamps: true }
);

// Virtual for fullname
UserSchema
    .virtual('fullname')
    .get(function () {
        return this.first_name + "," + this.last_name;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);

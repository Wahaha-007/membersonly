var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 50 },
        text: { type: String, required : true },
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
    }, { timestamps: true }
);

// Virtual for message

MessageSchema
    .virtual('createdAt_short')
    .get(function () {
        return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
    });

MessageSchema
    .virtual('createdAt_date_only')
    .get(function () {
        //return DateTime.fromJSDate(this.createdAt).toFormat('yyyy-MM-dd');
        return DateTime.fromJSDate(this.createdAt).toRelativeCalendar();
    });

MessageSchema
.virtual('url')
.get(function () {
    return '/message/' + this._id;
});

//Export model
module.exports = mongoose.model('Message', MessageSchema);
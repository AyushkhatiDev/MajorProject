const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500,
        validate: {
            validator: (v) => {
                return /\S/.test(v);
            },
            message: (props) => `${props.value} is not a valid comment!`
        }
    },
    rating: {
        type : Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);
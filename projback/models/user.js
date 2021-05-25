const mongoose = require("mongoose"); // mongoose for mongo database
const crypto = require("crypto");
var { v4: uuidv4 } = require("uuid");

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // compulsary to fill
      maxlength: 32,
      trim: true, // means delete spaces before and after name :)
    },
    lastname: {
      type: String, // not required
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userinfo: {
      type: String,
      trim: true,
    },

    encry_password: {
      type: String,
      required: true,
    },
    salt: String, // just a toll help to make password encrypted
    role: {
      // role 0 means user and role 1 means admin
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [], // when a list is there, use array
    },
  },
  { timestamps: true } // it means record time when user signUp or update his profile
);

userSchema
  .virtual("password") // virtual means change value at the time when user enters value, here we are changing value of password to hash-password
  .set(function (password) {
    this._password = password; // storing value of password, if required
    this.salt = uuidv4(); // generate a random value
    this.encry_password = this.securePassword(password); // see below "securePassword" method
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    // see documentation
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt) // we have to pass some secret key, we are passing salt generated through "uuidv4"
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
// exporting , so that we can use it anywhere by simply importing.

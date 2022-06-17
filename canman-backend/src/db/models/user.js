const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      validate(value) {
        if (value == "password") {
          throw new Error("Password is not valid!");
        }
        const rexp =
          /(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/gmu;

        if (!rexp.test(value)) {
          throw new Error(
            "Password should be contain at least One Uppercase , One lowercase, One Numeric, One Special Character"
          );
        }
      },
    },
    phoneNumber: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Phone Number is not valid!");
        }
        if (value?.toString().length > 10) {
          throw new Error("Upto 10 digit long Phone Number is valid!");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Deleting password and token for user objects
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

//Authentication token(JWT) generate
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens[0] = { token };
  // user.tokens = user.tokens.concat({ token });
  user.save();

  return token;
};

// Find user by credentials
userSchema.statics.findByCredential = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Please provide valid credentials!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Please provide valid credentials!");
  }
  return user;
};

//hash password berore saving to database
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Create users collection
const User = mongoose.model("User", userSchema);

module.exports = User;

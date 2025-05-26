const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        googleId:{
            type: 'string',
        },
        FirstName: {
            type: String,
            required: true,
            trim: true,
        },
        LastName: {
            type: String,
            required: true,
            trim: true,
        },
        Email: {
            type: String,
            required: true
        },
        Phone: {
            type: String,
            required: true
        },
        Password: {
            type: String,
          //  required: true
        },
        Photo: {
            type: String
        },
        OTP: {
            otp: {
                type: String,  
            },
            expiresAt: {
                type: Date,  
            },
        }
    }, 
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.Password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 20,
        },

        lastName: {
            type: String,
            minLength: 3,
            maxLength: 20,
        },

        emailId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            immutable: true,
        },

        age: {
            type: Number,
            min: 6,
            max: 80,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        problemSolved: [
            {
                type: Schema.Types.ObjectId,
                ref: "Problem",
                // unique:true
            },
        ],

        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
// Ab agar tum user delete kar do:
// await User.findOneAndDelete({ _id: U1 }); (To normally sirf User delete hoga.)

// Submission
// ----------------
// userId : U1
// Problem : Two Sum

// userId : U1
// Problem : Graph

// Ye submissions database me reh jayengi.
// Inhe kehte hain orphan data

// User Delete

// ↓

// Automatically

// ↓

// Us user ki sari submissions bhi delete


//post matlab operation hone ke baad ye function chalega. Aur findOneAndDelete ke baad ye function chalega.
userSchema.post("findOneAndDelete", async function (userInfo) {
    if (userInfo) {
        await mongoose.model("Submission").deleteMany({
            userId: userInfo._id,
        });
    }
});


userSchema.pre("save", async function () {

    if (!this.isModified("password")) { return; }

    this.password = await bcrypt.hash(this.password, 10);

});
const User = mongoose.model("User", userSchema);

export default User;
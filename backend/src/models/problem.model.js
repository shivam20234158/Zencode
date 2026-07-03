import mongoose from "mongoose";

const { Schema } = mongoose;

const problemSchema = new Schema(
    {

        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        tags: [
            {
                type: String,
            },
        ],

        visibleTestCases: [
            {
                input: String,
                output: String,
                explanation: String,
            },
        ],

        hiddenTestCases: [
            {
                input: String,
                output: String,
            },
        ],

        startCode: [
            {
                language: {
                    type: String,
                    required: true,
                },

                initialCode: {
                    type: String,
                    required: true,
                },
            },
        ],

        referenceSolution: [
            {
                language: {
                    type: String,
                    required: true,
                },

                completeCode: {
                    type: String,
                    required: true,
                },
            },
        ],

        constraints: {
            type: String,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
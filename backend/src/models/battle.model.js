import mongoose from "mongoose";
const { Schema } = mongoose;

const battlePlayerSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastSubmissionId: {
            type: Schema.Types.ObjectId,
            ref: "Submission",
            default: null,
        },
        acceptedSubmissionId: {
            type: Schema.Types.ObjectId,
            ref: "Submission",
            default: null,
        },
        status: {
            type: String,
            enum: ["coding", "submitted", "accepted", "failed"],
            default: "coding",
        },
        acceptedAt: {
            type: Date,
            default: null,
        },
        submissionCount: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const battleSchema = new Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true,
    },
    problem: {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true,
    },
    timeLimitMinutes: {
        type: Number,
        required: true,
        enum: [15, 30, 45],
    },
    players: {
        type: [battlePlayerSchema],
        validate: {
            validator: function (players) {
                return players.length <= 2;
            },
            message: "A battle can have at most 2 players.",
        },
    },
    status: {
        type: String,
        enum: ["waiting", "active", "completed", "cancelled"],
        default: "waiting",
    },
    winner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    isDraw: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    waitingDeadline: {
        type: Date,
        default: null,
    },
    startedAt: {
        type: Date,
        default: null,
    },
    deadline: {
        type: Date,
        default: null,
    },
    endedAt: {
        type: Date,
        default: null,
    },

    // ─── Idempotency Flag ───
    // Ensures user battle stats (won/lost/drawn) are updated only once
    // even if BullMQ retries the job
    statsUpdated: {
        type: Boolean,
        default: false,
    },

    // ─── Timeout Job IDs ───
    // Store BullMQ job IDs so we can cancel them if needed
    waitingTimeoutJobId: {
        type: String,
        default: null,
    },
    battleDeadlineJobId: {
        type: String,
        default: null,
    },
});
// Fast lookup by room code (already unique, so automatically indexed)
// Index for finding user's battle history efficiently
battleSchema.index({ "players.user": 1, createdAt: -1 });

// Index for finding active/waiting battles (used by timeout worker)
battleSchema.index({ status: 1 });

const Battle = mongoose.model("Battle", battleSchema);

export default Battle;

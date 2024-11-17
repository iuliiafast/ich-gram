import mongoose from 'mongoose';
const followSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Follow = mongoose.model('Follow', followSchema);
export default Follow;

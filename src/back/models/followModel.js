import mongoose from 'mongoose';
const followSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
    followerProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    followedProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
}, { timestamps: true });

const Follow = mongoose.model('Follow', followSchema);
export default Follow;

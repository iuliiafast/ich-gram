import mongoose from 'mongoose';
const exploreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const ExplorePost = mongoose.model('ExplorePost', exploreSchema);
export default ExplorePost;

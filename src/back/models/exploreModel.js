import mongoose from 'mongoose';
const exploreSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
}, { timestamps: true });

const ExplorePost = mongoose.model('ExplorePost', exploreSchema);
export default ExplorePost;

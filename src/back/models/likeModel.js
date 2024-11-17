import mongoose from 'mongoose';
const likeSchema = new mongoose.Schema({
    rofileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: false },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;

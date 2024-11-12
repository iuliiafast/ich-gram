import mongoose from 'mongoose';
let nextProfileId = 1;
const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true, unique: true },
    profileId: { type: Number, unique: true, default: () => nextProfileId++ },
    fullname: { type: String, required: true },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    followers_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 },
    posts_count: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now }
}, { timestamps: true });
const Profile = mongoose.model('Profile', profileSchema);
export default Profile;

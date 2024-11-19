import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    avatar: { type: String, default: `/default-avatar.png` },
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    website: { type: String, default: '' },
});

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        userName: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        password: { type: String, required: true },
        profile: { type: profileSchema, default: {} }
    }, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

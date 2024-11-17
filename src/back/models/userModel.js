import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        userName: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String, default: '/default-avatar.png' },
        postsCount: { type: Number, default: 0 },
        followersCount: { type: Number, default: 0 },
        followingCount: { type: Number, default: 0 },
        bio: { type: String, default: '' },
        website: { type: String, default: '' },
    }, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (err) {
            return next(err);
        }
    }
    next();
});

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});


const User = mongoose.model('User', userSchema);

export default User;

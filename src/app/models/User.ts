import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
/*
import { Document, Types, model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  followers: Array<Types.ObjectId>;
  following: Array<Types.ObjectId>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 20, index: true },
  email: { type: String, required: true, unique: true, index: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default model<IUser>('User', userSchema);
*/


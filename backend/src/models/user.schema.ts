import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  name: { type: String, required: true },
  bio: { type: String, required: false },
});

UserSchema.pre('save', async function (next: any) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashPass = await bcrypt.hash(this['password'], 10);
    this['password'] = hashPass;
    return next();
  } catch (err) {
    return next(err);
  }
});

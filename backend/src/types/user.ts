import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  name: string;
  phone: string;
  bio: string;
  password: string;
  facebook?: {
    id: string;
    avatar: string;
  };
  images?: {
    url: string;
    label: string;
  }[];
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as mongodb from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { Task } from 'src/types/task';
import { RegisterDTO } from './register.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO, LoginDTO } from 'src/auth/login.dto';
import { Payload } from 'src/types/payload';
import { v4 as uuid } from 'uuid';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Task') private taskModel: Model<Task>,
  ) {}

  readonly azureConnection = process.env.AZURE_STORAGE_CONNECTION_STRING;
  readonly azurePublicUrl =
    'https://storagegallery.blob.core.windows.net/gallery';
  containerName: string;

  async create(RegisterDTO: RegisterDTO) {
    const { email, password, phone, bio, name } = RegisterDTO;
    const user = await this.userModel.findOne({ email: email });
    if (user) {
      throw new HttpException(
        'user already registered !',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdUser = new this.userModel();
    createdUser.email = email;
    createdUser.name = name;
    createdUser.phone = phone;
    createdUser.bio = bio;
    createdUser.password = password;

    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async findOrCreateFacebook(profile: any) {
    const user = await this.userModel
      .findOne({ 'facebook.id': profile.id })
      .exec();
    if (user) {
      return user;
    }
    const createdUser = new this.userModel({
      email: profile.emails[0].value,
      name: profile.name.givenName + ' ' + profile.name.familyName,
      Facebook: {
        id: profile.id,
        avatar: profile.photos[0].value,
      },
      password: 'Facebook' + profile.id,
      phone: 'N/A',
      bio: 'N/A',
    });
    return createdUser.save();
  }

  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Invalid Credential', HttpStatus.BAD_REQUEST);
    }
  }
  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async checkPassword(data: { password: string }, userData: any) {
    console.log('DATA', data);
    const { password } = data;
    const user = await this.userModel.findOne({ email: userData.email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    let flag = false;
    if (bcrypt.compare(password, user.password)) {
      flag = true;
    }
    if (!flag) {
      throw new HttpException(
        'Invalid current Password',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return {
        message: 'Password matched',
      };
    }
  }

  async changePassword(UserDTO: ChangePasswordDTO, payload: Payload) {
    const { password, newPassword, confirmPassword } = UserDTO;
    const user = await this.userModel.findOne({ email: payload.email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (!bcrypt.compare(password, user.password)) {
      throw new HttpException(
        'Invalid current Password',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (newPassword !== confirmPassword) {
      throw new HttpException(
        'New password and confirm password does not match',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      user.password = newPassword;
      await user.save();
      return {
        message: 'Password changed successfully',
      };
    }
  }

  async updateProfile(user: User, userData: Partial<User>) {
    const { email, name, phone, bio } = userData;
    const findUser = await this.userModel.findOne({ email: user.email });
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    findUser.email = email ? email : findUser.email;
    findUser.name = name ? name : findUser.name;
    findUser.phone = phone ? phone : findUser.phone;
    findUser.bio = bio ? bio : findUser.bio;
    await findUser.save();
    return this.sanitizeUser(findUser);
  }

  async getTasks(user: User) {
    const tasks = await this.taskModel.find({ user: user._id }).exec();
    const taskData = tasks.map((task) => ({
      task_id: task._id,
      title: task.title,
      completed: task.completed,
      removed: task.removed,
    }));
    return taskData;
  }

  async createTask(task: Partial<Task>, user: User) {
    const createdTask = new this.taskModel({
      ...task,
      userId: user._id,
    });
    await createdTask.save();
    return createdTask;
  }

  async getActiveTasks(user: User) {
    const tasks = await this.taskModel
      .find({ userId: user._id, removed: false })
      .exec();
    const taskData = tasks.map((task) => ({
      task_id: task._id,
      title: task.title,
      completed: task.completed,
      removed: task.removed,
    }));
    return taskData;
  }

  async completeTask(taskId: any, user: User) {
    const trimmedTaskId = taskId.task_id.trim();
    const task = await this.taskModel
      .findOne({ _id: new mongodb.ObjectId(trimmedTaskId), userId: user._id })
      .exec();
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    }
    task.completed = !task.completed;
    await task.save();
    return task;
  }

  async deleteTask(taskId: any, user: User) {
    const trimmedTaskId = taskId.task_id.trim();
    const task = await this.taskModel
      .findOne({ _id: new mongodb.ObjectId(trimmedTaskId), userId: user._id })
      .exec();
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    }
    task.removed = true;
    await task.save();
    return task;
  }

  async searchTask(searchData: any, user: User) {
    const tasks = await this.taskModel
      .find({
        $and: [
          { userId: user._id },
          { removed: false },
          { title: { $regex: searchData.task.toString(), $options: 'i' } },
        ],
      })
      .exec();
    const taskData = tasks.map((task) => ({
      task_id: task._id,
      title: task.title,
      completed: task.completed,
      removed: task.removed,
    }));
    return taskData;
  }

  // -- blob -- //!SECTION
  getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerClient = blobClientService.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(
    file: Express.Multer.File,
    body: { label: string },
    containerName: string,
    user: User,
  ) {
    this.containerName = containerName;
    const imgUrl = uuid() + file.originalname;
    const blobClient = this.getBlobClient(imgUrl);
    await blobClient.uploadData(file.buffer);
    const publicUrl = `${this.azurePublicUrl}/${imgUrl}`;
    await this.uploadImage(publicUrl, body.label, user);
  }

  //   read file from azureblob
  // async getFile(fileName: string, containerName: string) {
  //   this.containerName = containerName;
  //   const blobClient = this.getBlobClient(fileName);
  //   const blobDownloaded = await blobClient.download();
  //   return blobDownloaded.readableStreamBody;
  // }
  //   delete file
  async deleteFile(filename: string, containerName: string, user: User) {
    this.containerName = containerName;
    const blobClient = this.getBlobClient(filename);
    await blobClient.deleteIfExists();
  }

  // get all images
  async getAllImages(user: User) {
    const findUserImages = await this.userModel
      .findOne({ email: user.email })
      .select('images');
    return findUserImages.images ? findUserImages.images : [];
  }
  async uploadImage(image: string, label: string, user: User) {
    const findUser = await this.userModel.findOne({ email: user.email });
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const imageObject = {
      url: image,
      label: label,
    };
    findUser.images.push(imageObject);
    await findUser.save();
    const sanitizedUser = this.sanitizeUser(findUser);
    return sanitizedUser;
  }

  async findImageByLabel(label: string, user: User) {
    const findUser = await this.userModel.findOne({ email: user.email });
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const findImage = findUser.images.find((image) => image.label === label);
    return findImage;
  }

  async deleteImage(imageURL: string, user: User) {
    const findUser = await this.userModel.findOne({ email: user.email });
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const findImage = findUser.images.find((image) => image.url === imageURL);
    if (!findImage) {
      throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
    }
    const index = findUser.images.indexOf(findImage);
    findUser.images.splice(index, 1);
    await findUser.save();
    const sanitizedUser = this.sanitizeUser(findUser);
    return sanitizedUser;
  }

  async updateImage(
    imageURL: string,
    containerName: string,
    file: Express.Multer.File,
    user: User,
  ) {
    const findUser = await this.userModel.findOne({ email: user.email });
    if (!findUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const findImage = findUser.images.find((image) => image.url == imageURL);

    if (!findImage) {
      throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
    }
    const index = findUser.images.indexOf(findImage);

    this.containerName = containerName;
    const imgUrl = uuid() + file.originalname;
    const blobClient = this.getBlobClient(imgUrl);
    await blobClient.uploadData(file.buffer);
    const publicUrl = `${this.azurePublicUrl}/${imgUrl}`;
    findUser.images[index].url = publicUrl;

    await findUser.save();
    const sanitizedUser = this.sanitizeUser(findUser);
    return sanitizedUser;
  }
}

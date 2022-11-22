import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  Req,
  HttpStatus,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RegisterDTO } from 'src/user/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { ChangePasswordDTO, LoginDTO } from './login.dto';
import { GetUser } from '../../decorator/get-user.decorator';
import { User } from 'src/types/user';
import { Payload } from 'src/types/payload';
import { Task } from 'src/types/task';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  containerName = 'gallery';
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/check')
  @UseGuards(AuthGuard('jwt'))
  async hiddenInformation() {
    return 'Auth Working';
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    const user = await this.userService.create(registerDTO);
    const payload = {
      email: user.email,
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.findByLogin(loginDTO);
    const payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @GetUser() user: Payload,
  ) {
    return await this.userService.changePassword(changePasswordDTO, user);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser() user: User) {
    return this.userService.sanitizeUser(user);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Body() userData: Partial<User>, @GetUser() user: User) {
    return this.userService.updateProfile(user, userData);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: any): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
      request: req,
    };
  }

  @Get('/tasks')
  @UseGuards(AuthGuard('jwt'))
  async getTasks(@GetUser() user: User) {
    return this.userService.getTasks(user);
  }

  @Get('/tasks-active')
  @UseGuards(AuthGuard('jwt'))
  async getActiveTasks(@GetUser() user: User) {
    return this.userService.getActiveTasks(user);
  }

  @Post('/tasks')
  @UseGuards(AuthGuard('jwt'))
  async createTask(@Body() task: Partial<Task>, @GetUser() user: User) {
    return this.userService.createTask(task, user);
  }

  // complete a task
  @Patch('/tasks-complete')
  @UseGuards(AuthGuard('jwt'))
  async completeTask(@Body() task_id: any, @GetUser() user: User) {
    return this.userService.completeTask(task_id, user);
  }

  // delete a task
  @Delete('/tasks-delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteTask(@Body() task_id: any, @GetUser() user: User) {
    return this.userService.deleteTask(task_id, user);
  }

  @Post('/task-search')
  @UseGuards(AuthGuard('jwt'))
  async searchTask(@Body() task: any, @GetUser() user: User) {
    return this.userService.searchTask(task, user);
  }

  @Post('/upload-image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
  async uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
    @GetUser() user: User,
    @Req() req: any,
  ) {
    return {
      statusCode: HttpStatus.OK,
      data: file,
    };
    // return this.userService.uploadImage(image, user);
  }

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @GetUser() user: User,
  ) {
    await this.userService.upload(file, body, this.containerName, user);
  }

  // delete file
  @Delete('/:filename')
  async delete(
    @Param('filename') filename: string,
    @GetUser() user: User,
  ): Promise<string> {
    await this.userService.deleteFile(filename, this.containerName, user);
    return 'deleted';
  }

  @Get('/all/images')
  @UseGuards(AuthGuard('jwt'))
  async getAllImages(@GetUser() user: User) {
    return await this.userService.getAllImages(user);
  }

  @Get('/image/label')
  @UseGuards(AuthGuard('jwt'))
  async findImageByLabel(
    @Body() body: { label: string },
    @GetUser() user: User,
  ) {
    return await this.userService.findImageByLabel(body.label, user);
  }

  @Delete('/image/delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteImage(@Body() body: { image: string }, @GetUser() user: User) {
    return await this.userService.deleteImage(body.image, user);
  }

  @Patch('/image/update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Body() body: { imageURL: string },
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    console.log('Update Body', body);
    return await this.userService.updateImage(
      body.imageURL,
      this.containerName,
      file,
      user,
    );
  }
}

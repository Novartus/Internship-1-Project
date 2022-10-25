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

@Controller('auth')
export class AuthController {
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
}

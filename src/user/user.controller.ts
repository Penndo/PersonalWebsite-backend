import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService, UserInfoDto } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(): Promise<UserInfoDto> {
    return this.userService.getProfile();
  }

  @Put('profile')
  updateProfile(
    @Body()
    payload: Partial<UserInfoDto>,
  ): Promise<UserInfoDto> {
    return this.userService.upsertProfile(payload);
  }
}

import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfile } from './user-profile.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(): Promise<UserProfile | null> {
    return this.userService.getProfile();
  }

  @Put('profile')
  updateProfile(
    @Body()
    payload: Partial<UserProfile>,
  ): Promise<UserProfile> {
    return this.userService.upsertProfile(payload);
  }
}

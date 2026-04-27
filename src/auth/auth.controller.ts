import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, type AuthenticatedRequest } from './auth.guard';
import { AuthService } from './auth.service';

interface LoginDto {
  username?: string;
  password?: string;
}

interface ChangePasswordDto {
  oldPassword?: string;
  newPassword?: string;
}

function extractBearer(req: AuthenticatedRequest): string | null {
  const header = req.headers['authorization'] ?? req.headers['Authorization'];
  if (!header || typeof header !== 'string') return null;
  const [scheme, value] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !value) return null;
  return value.trim();
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    const username = (body?.username ?? '').trim();
    const password = body?.password ?? '';
    if (!username || !password) {
      throw new BadRequestException('用户名和密码不能为空');
    }
    const result = await this.authService.login(username, password);
    return result;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return { username: req.authUsername };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Req() req: AuthenticatedRequest) {
    this.authService.logout(extractBearer(req));
    return { ok: true };
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: ChangePasswordDto,
  ) {
    const oldPassword = body?.oldPassword ?? '';
    const newPassword = body?.newPassword ?? '';
    if (!oldPassword || !newPassword) {
      throw new BadRequestException('原密码和新密码不能为空');
    }
    await this.authService.changePassword(
      req.authUsername as string,
      oldPassword,
      newPassword,
    );
    return { ok: true };
  }
}

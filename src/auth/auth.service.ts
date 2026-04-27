import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { Repository } from 'typeorm';
import { AdminCredential } from './admin-credential.entity';

const DEFAULT_USERNAME = 'yeatfish';
const DEFAULT_PASSWORD = 'Aa123456';
const SCRYPT_KEYLEN = 64;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 天

interface TokenRecord {
  username: string;
  expiresAt: number;
}

export interface LoginResult {
  token: string;
  username: string;
  expiresAt: number;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  /** 内存级会话表；进程重启即失效，单管理员场景足够 */
  private readonly tokens = new Map<string, TokenRecord>();

  constructor(
    @InjectRepository(AdminCredential)
    private readonly credentialRepository: Repository<AdminCredential>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.credentialRepository.count();
    if (count === 0) {
      await this.persistCredential(DEFAULT_USERNAME, DEFAULT_PASSWORD);
      this.logger.log(
        `已初始化默认管理员账号：${DEFAULT_USERNAME} / ${DEFAULT_PASSWORD}（请尽快登录后修改密码）`,
      );
    }
  }

  async login(username: string, password: string): Promise<LoginResult> {
    const account = await this.findByUsername(username);
    if (!account || !this.verifyPassword(password, account)) {
      throw new UnauthorizedException('用户名或密码不正确');
    }
    return this.issueToken(account.username);
  }

  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (!newPassword || newPassword.length < 6) {
      throw new ConflictException('新密码长度至少为 6 位');
    }
    if (oldPassword === newPassword) {
      throw new ConflictException('新密码不能与旧密码相同');
    }
    const account = await this.findByUsername(username);
    if (!account || !this.verifyPassword(oldPassword, account)) {
      throw new UnauthorizedException('原密码不正确');
    }
    const { salt, hash } = this.hashPassword(newPassword);
    account.passwordSalt = salt;
    account.passwordHash = hash;
    await this.credentialRepository.save(account);
    this.invalidateAllTokensFor(account.username);
  }

  validateToken(token: string | undefined | null): string | null {
    if (!token) return null;
    const record = this.tokens.get(token);
    if (!record) return null;
    if (record.expiresAt <= Date.now()) {
      this.tokens.delete(token);
      return null;
    }
    return record.username;
  }

  logout(token: string | undefined | null): void {
    if (token) this.tokens.delete(token);
  }

  // ---------- internal helpers ----------

  private async findByUsername(
    username: string,
  ): Promise<AdminCredential | null> {
    if (!username) return null;
    return this.credentialRepository.findOne({ where: { username } });
  }

  private async persistCredential(
    username: string,
    plainPassword: string,
  ): Promise<void> {
    const { salt, hash } = this.hashPassword(plainPassword);
    const credential = this.credentialRepository.create({
      username,
      passwordSalt: salt,
      passwordHash: hash,
    });
    await this.credentialRepository.save(credential);
  }

  private hashPassword(plain: string): { salt: string; hash: string } {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(plain, salt, SCRYPT_KEYLEN).toString('hex');
    return { salt, hash };
  }

  private verifyPassword(plain: string, account: AdminCredential): boolean {
    const expected = Buffer.from(account.passwordHash, 'hex');
    let candidate: Buffer;
    try {
      candidate = scryptSync(plain ?? '', account.passwordSalt, SCRYPT_KEYLEN);
    } catch {
      return false;
    }
    if (expected.length !== candidate.length) return false;
    return timingSafeEqual(expected, candidate);
  }

  private issueToken(username: string): LoginResult {
    const token = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + TOKEN_TTL_MS;
    this.tokens.set(token, { username, expiresAt });
    this.sweepExpired();
    return { token, username, expiresAt };
  }

  private invalidateAllTokensFor(username: string): void {
    for (const [token, record] of this.tokens) {
      if (record.username === username) this.tokens.delete(token);
    }
  }

  private sweepExpired(): void {
    if (this.tokens.size < 32) return;
    const now = Date.now();
    for (const [token, record] of this.tokens) {
      if (record.expiresAt <= now) this.tokens.delete(token);
    }
  }
}

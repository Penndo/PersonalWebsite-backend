import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 管理员账号凭证。
 * - 数据库只保存 scrypt 哈希后的密码 + 随机盐，不保存明文。
 * - 用户名建立唯一索引，便于登录时按用户名查询。
 */
@Entity({ name: 'admin_credential' })
export class AdminCredential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  username: string;

  /** scrypt 派生密钥的十六进制字符串（长度 128 = 64 字节） */
  @Column({ type: 'varchar', length: 256 })
  passwordHash: string;

  /** 与每个账号绑定的随机盐（hex） */
  @Column({ type: 'varchar', length: 64 })
  passwordSalt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

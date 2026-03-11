import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  avatarUrl: string | null;

  @Column({ nullable: true })
  logoUrl: string | null;

  @Column({ length: 100 })
  displayName: string;

  @Column({ length: 200, nullable: true })
  introTitle: string | null;

  @Column({ type: 'text', nullable: true })
  introContent: string | null;

  @Column({ type: 'int', default: 0 })
  age: number;

  @Column({ type: 'simple-json', nullable: true })
  hobbies: string[] | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

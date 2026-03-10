import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plugin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 150, unique: true })
  routeId: string;

  @Column({ length: 300 })
  summary: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ nullable: true })
  coverUrl: string | null;

  @Column({ nullable: true })
  repositoryUrl: string | null;

  @Column({ nullable: true })
  downloadUrl: string | null;

  @Column({ length: 50, nullable: true })
  version: string | null;

  @Column({ type: 'simple-json', nullable: true })
  tags: string[] | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}


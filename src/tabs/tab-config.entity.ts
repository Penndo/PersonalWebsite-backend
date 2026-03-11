import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TabConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  key: string;

  @Column({ length: 50 })
  label: string;

  @Column({ type: 'int', default: 0 })
  'order': number;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;
}

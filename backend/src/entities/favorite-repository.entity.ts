import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('favorite_repositories')
export class FavoriteRepository {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @Column()
  repo: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  savedAt: Date;
}
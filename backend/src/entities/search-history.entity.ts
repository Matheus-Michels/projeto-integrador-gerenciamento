import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('search_history')
export class SearchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  repositoryUrl: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  searchedAt: Date;
}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users.js';
import { Quizzes } from './Quizzes.js';

@Entity('results')
export class Results {
  @PrimaryGeneratedColumn('uuid', { name: 'result_id' })
  resultId!: string;

  @ManyToOne(() => Users, (user) => user.results)
  @JoinColumn({
    name: 'user_id',
  })
  user!: Users;

  @ManyToOne(() => Quizzes, (quiz) => quiz.results, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'quiz_id',
  })
  quiz!: Quizzes;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  score!: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Quizzes } from './Quizzes.js';
import { Options } from './Options.js';

@Entity('questions')
export class Questions {
  @PrimaryGeneratedColumn('uuid', { name: 'question_id' })
  questionId!: string;

  @ManyToOne(() => Quizzes, (quiz) => quiz.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'quiz_id',
  })
  quiz!: Quizzes;

  @Column({
    name: 'question_text',
    type: 'text',
  })
  questionText!: string;

  @OneToOne(() => Options, {
    nullable: true,
  })
  @JoinColumn({
    name: 'correct_option_id',
  })
  correctOption?: Options;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;

  @OneToMany(() => Options, (option) => option.question)
  options!: Options[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Courses } from './Courses.js';
import { Questions } from './Questions.js';
import { Results } from './Results.js';

@Entity('quizzes')
export class Quizzes {
  @PrimaryGeneratedColumn('uuid', { name: 'quiz_id' })
  quizId!: string;

  @ManyToOne(() => Courses, (course) => course.quizzes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'course_id',
  })
  course!: Courses;

  @Column({
    type: 'text',
    name: 'quiz_name',
  })
  quizName!: string;

  @Column({
    name: 'deactivated_at',
    type: 'timestamp',
    nullable: true,
  })
  deactivatedAt?: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;

  @OneToMany(() => Questions, (question) => question.quiz)
  questions!: Questions[];

  @OneToMany(() => Results, (result) => result.quiz)
  results!: Results[];
}

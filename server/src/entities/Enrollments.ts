import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
  Unique,
} from 'typeorm';
import { Users } from './Users.js';
import { Courses } from './Courses.js';

@Unique(['user', 'course'])
@Entity('enrollments')
export class Enrollments {
  @PrimaryGeneratedColumn('uuid', { name: 'enrollment_id' })
  enrollmentId!: string;

  @ManyToOne(() => Users, (user) => user.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: Users;

  @ManyToOne(() => Courses, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'course_id',
  })
  course!: Courses;

  @CreateDateColumn({
    name: 'enrolled_at',
  })
  enrolledAt!: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive!: boolean;

  @Column({
    name: 'completed_at',
    type: 'timestamp',
    nullable: true,
  })
  completedAt?: Date;
}

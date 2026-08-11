import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Courses } from './Courses.js';

@Entity('lessons')
export class Lessons {
  @PrimaryGeneratedColumn('uuid', { name: 'lesson_id' })
  lessonId!: string;

  @ManyToOne(() => Courses, (course) => course.lessons)
  @JoinColumn({
    name: 'course_id',
  })
  course!: Courses;

  @Column({
    type: 'text',
    name: 'lesson_name',
    nullable: true,
    default: 'Lesson',
  })
  lessonName!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'text',
    name: 'video_link',
    nullable: true,
  })
  videoLink?: string;

  @Column({
    type: 'int',
    name: 'sort_order',
    default: 0,
  })
  sortOrder!: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}

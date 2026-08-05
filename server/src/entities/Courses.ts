import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique
} from "typeorm";
import { Users } from "./Users.js";
import { Lessons } from "./Lessons.js";
import { Quizzes } from "./Quizzes.js";
import { Enrollments } from "./Enrollments.js";

@Unique(["user", "course"])
@Entity("courses")
export class Courses {
  @PrimaryGeneratedColumn("uuid",{name:'course_id'})
  courseId!: string;

  @Column({
    name: "course_name",
    type:'text'
  })
  courseName!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description?: string;

  @ManyToOne(() => Users, (user) => user.courses)
  @JoinColumn({
    name: "created_by",
  })
  createdBy!: Users;

  @Column({
    type:'boolean',
    name: "is_active",
    default: true,
  })
  isActive!: boolean;

  @Column({
    name: "deactivated_at",
    type: "timestamp",
    nullable: true,
  })
  deactivatedAt?: Date;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt!: Date;

  @OneToMany(() => Lessons, (lesson) => lesson.course)
  lessons!: Lessons[];

  @OneToMany(()=>Enrollments,(enrollment) => enrollment.course)
  enrollments!:Enrollments

  @OneToMany(() => Quizzes, (quiz) => quiz.course)
  quizzes!: Quizzes[];
}
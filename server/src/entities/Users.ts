import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Roles } from "./Roles.js";
import { Courses } from "./Courses.js";
import { Results } from "./Results.js";
import { Enrollments } from "./Enrollments.js";

@Entity("user_details")
export class Users {
  @PrimaryGeneratedColumn("uuid",{name:'user_id'})
  userId!: string;

  @Column({
      type: "text",
    unique: true,
  })
  username!: string;

  @Column({
      type: "text",
    unique: true,
  })
  email!: string;

  @Column({
    type:'varchar',
    name: "password_hash",
    length: 255,
  })
  passwordHash!: string;

  @ManyToOne(() => Roles, (role) => role.users)
  @JoinColumn({
    name: "role_id",
  })
  role!: Roles;

  @Column({type:'text',name:'college_name'})
  collegeName!:string


  @Column({ type: "text", nullable: true })
  profile_image_path!: string | null;

  @Column({
    name: "refresh_token",
    type: "text",
    nullable: true,
  })
  refreshToken?: string;

  @Column({
    name: "last_login_at",
    type: "timestamp",
    nullable: true,
  })
  lastLoginAt?: Date;

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

  @OneToMany(() => Courses, (course) => course.createdBy)
  courses!: Courses[];

  @OneToMany(() => Results, (result) => result.user)
  results!: Results[];
  
  @OneToMany(() => Enrollments,(enrollment) => enrollment.user)
  enrollments!:Enrollments[]
}
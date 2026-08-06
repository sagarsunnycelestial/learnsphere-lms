import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Users } from "./Users.js";
import { UserRoles } from "../../types/types.js";

@Entity("roles")
export class Roles {
  @PrimaryGeneratedColumn("uuid",{name:'role_id'})
  roleId!: string;

  @Column({
    name: "role_name",
    type:'text',
    unique: true,
  })
  roleName!: UserRoles;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt!: Date;

  @OneToMany(() => Users, (user) => user.role)
  users!: Users[];
}
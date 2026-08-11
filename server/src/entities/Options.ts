import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Questions } from './Questions.js';

@Entity('options')
export class Options {
  @PrimaryGeneratedColumn('uuid', { name: 'option_id' })
  optionId!: string;

  @ManyToOne(() => Questions, (question) => question.options,{
    onDelete:'CASCADE'
  })
  @JoinColumn({
    name: 'question_id',
  })
  question!: Questions;

  @Column({
    name: 'option_text',
    type: 'text',
  })
  optionText!: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}

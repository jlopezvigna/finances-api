import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Category } from "./Category";

@ObjectType()
@Entity()
export class Bill extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  amount!: number;

  @Field(() => String)
  @Column({ default: new Date() })
  period: Date;

  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

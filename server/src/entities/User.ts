import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity() // db table
export class User extends BaseEntity {
  @Field(_type => ID) // nch với graphql
  @PrimaryGeneratedColumn() // cột primary tự tăng
  id!: number;

  //! decorator
  @Field()
  @Column({ unique: true }) // tạo ra một cột, unique: duy nhất 
  username!: string;

  @Field() //graplql
  @Column({ unique: true }) //typeorm
  email!: string;

  @Column()
  password!: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
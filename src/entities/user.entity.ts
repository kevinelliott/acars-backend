import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  RelationCount,
  AfterLoad,
} from 'typeorm';
import * as crypto from 'crypto';

import { Station } from './station.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(type => Station, station => station.user)
  stations: [];

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  encrypted_password: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  role: String;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  public gravatarUrl: string;

  @AfterLoad()
  setGravatarUrl() {
    if (this.email != null) {
      const size = 100;
      const md5 = crypto.createHash('md5').update(this.email).digest("hex");
      this.gravatarUrl = "https://www.gravatar.com/avatar/" + md5 + "?s=" + size;
    }
  }
}

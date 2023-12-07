import { BeforeInsert, BeforeUpdate, Entity, ManyToOne, OneToMany } from "typeorm";
import { PrimaryGeneratedColumn, Column } from "typeorm";
import { ProductImage } from "./prodcut-image.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

@Entity({ name: 'products'})
export class Prodcut {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text', { unique: true })
    title: string;
    
    @Column('float', {
        default: 0,
    })
    price: number;
    
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;
    
    @Column({
        unique: true,
    })
    slug: string;
    
    @Column('int', {
        default: 0,
    })
    stock: number;
    
    @Column('text', {
        array: true,
    })
    sizes: string[];
    
    @Column('text')
    gender: string;
    
    @Column({
        type: 'text',
        array: true,
        default: [],
    })
    tags: string[];
    
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager: true}
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
          this.slug = this.title;
        }
        this.slug = this.slug
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
    
}

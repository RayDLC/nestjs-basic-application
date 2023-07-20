import { BeforeInsert, BeforeUpdate, Entity, ManyToOne, OneToMany } from "typeorm";
import { PrimaryGeneratedColumn, Column } from "typeorm";
import { ProductImage } from "./prodcut-image.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products'})
export class Prodcut {

    @ApiProperty({
        example: '087e8628-dc19-4d19-bf2a-b1f27ff487a9',
        description: 'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true,
    })
    @Column('text', { unique: true })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column('float', {
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: 'Description of an awesome product',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true,
    })
    @Column({
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example: ['S', 'M', 'L', 'XL'],
        description: 'Product sizes',
    })
    @Column('text', {
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['shirt'],
        description: 'Product tags',
    })
    @Column({
        type: 'text',
        array: true,
        default: [],
    })
    tags: string[];

    @ApiProperty({
        example: ['8529342-00-A_0_2000.jpg'],
        description: 'Product images',
        uniqueItems: true,
    })
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

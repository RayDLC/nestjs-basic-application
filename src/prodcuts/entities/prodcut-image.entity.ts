import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, VirtualColumn } from "typeorm";
import { Prodcut } from "./prodcut.entity";


@Entity({ name: 'product_images'})
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(() => Prodcut, (product) => product.images, { onDelete: 'CASCADE' })
    product: Prodcut;
}
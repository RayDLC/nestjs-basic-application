import { Prodcut } from "../../prodcuts/entities";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tb_users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true,
    })
    email: string;

    @Column({
        type: 'text',
        select: false,
    })
    password: string;

    @Column({
        type: 'text',
    })
    fullName: string;

    @Column({
        type: 'bool',
        default: true,
    })
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ['user'],
    })
    roles: string[];

    @OneToMany(
        () => Prodcut,
        (product) => product.user,
    )
    product: Prodcut;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeInsert()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}

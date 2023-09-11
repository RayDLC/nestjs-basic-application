import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';

interface ConnectedClients { 
    [id: string]: {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessagesWsService {
    private connectectedClients: ConnectedClients = {};

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({id: userId});
        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User is not active');

        this.checkUserConnection(user);

        this.connectectedClients[client.id] = {
            socket: client,
            user: user
        };
    }

    removeClient(clientId: string) {
        delete this.connectectedClients[clientId];
    }

    getConnectedClients(): string[] {
        return Object.keys(this.connectectedClients);
    }

    getUserFullNameBySocketId(socketId: string){
        return this.connectectedClients[socketId].user.fullName;
    }

    private checkUserConnection(user: User) {
        for (const clienId of Object.keys(this.connectectedClients)) {
            const connectedClient = this.connectectedClients[clienId];
            if(connectedClient.user.id === user.id){
                connectedClient.socket.disconnect();
                break;
            }
        }
    }
}

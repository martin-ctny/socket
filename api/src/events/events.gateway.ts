import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { decode } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userService: UserService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  private connectedUsers = [];
  private rooms = [
    {
      id: 1,
      name: 'general',
      users: [],
      messages: [],
    },
  ];

  async handleConnection(client: Socket) {
    // console.log('Client connected');©©
    const { token } = client.handshake.headers;
    // console.log(token);

    if (!token) {
      return;
    }

    if (typeof token === 'string') {
      const decoded: any = decode(token);
      const { username } = decoded;
      // console.log(username);
      const user = await this.userService.findOneByUsername(username);
      // console.log(user);
      // await this.connectedUsersService.create({ socketId: client.id, user });

      this.connectedUsers.push({
        user,
        socketId: client.id,
      });
      // console.log(this.connectedUsers);
      this.server.emit('users', this.connectedUsers);
      this.server.emit('rooms', this.rooms);
    }
  }

  async handleDisconnect(client: Socket) {
    // console.log('Client disconnected');
    const user = this.connectedUsers.find(
      (connectedUser) => connectedUser.socketId === client.id,
    );
    if (user) {
      // await this.connectedUsersService.delete(user.id);
      this.connectedUsers = this.connectedUsers.filter(
        (connectedUser) => connectedUser.socketId !== client.id,
      );
      this.server.emit('users', this.connectedUsers);
    }
  }
  @SubscribeMessage('newMessage')
  async sendMessage(client: Socket, data: any) {
    console.log('roomName', data.roomName);
    console.log('message', data.message);

    // Rechercher l'utilisateur correspondant à partir de son ID de socket
    const user = this.connectedUsers.find(
      (connectedUser) => connectedUser.socketId === client.id,
    );

    if (!user) {
      console.log('User not found!');
      return;
    }

    const roomIndex = this.rooms.findIndex(
      (room) => room.name === data.roomName,
    );

    if (roomIndex !== -1) {
      const newMessage = {
        user: {
          id: user.socketId, // Utilisation du socketId comme ID de l'utilisateur
          name: user.user.username, // Supposant que le nom d'utilisateur est stocké sous 'username'
        },
        message: data.message,
        time: new Date(),
      };
      this.rooms[roomIndex].messages.push(newMessage);
      console.log(this.rooms[roomIndex].messages);

      console.log(
        `Nouveau message dans la chambre ${data.roomName}:`,
        newMessage,
      );

      this.server.emit('rooms', this.rooms);
    } else {
      console.log(`La room ${data.roomName} n'existe pas`);
    }
  }

  // @SubscribeMessage('joinRoom')
  // async handleJoinRoom(client: Socket, roomId: string) {
  //   client.join(roomId);
  //   // console.log(roomId);

  //   console.log(`Client ${client} joined room ${roomId}`);

  //   const user = this.connectedUsers.find(
  //     (connectedUser) => connectedUser.socketId === client.id,
  //   );
  //   this.server.to(roomId).emit('userJoined', user);
  // }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomName: string) {
    if (!this.rooms.find((room) => room.name === roomName)) {
      this.rooms.push({
        id: this.rooms.length + 1,
        name: roomName,
        users: [],
        messages: [],
      });
      // console.log(this.rooms);
      this.server.emit('rooms', this.rooms);
    } else {
      // console.log('La room existe déjà');
      client.join(roomName);

      const user = this.connectedUsers.find(
        (connectedUser) => connectedUser.socketId === client.id,
      );

      if (!user) {
        return;
      }

      const roomIndex = this.rooms.findIndex((room) => room.name === roomName);

      if (roomIndex) {
        const existingUserIndex = this.rooms[roomIndex].users.findIndex(
          (existingUser) => existingUser.socketId === user.socketId,
        );
        // console.log('Index de lutilisateur existant :', existingUserIndex);

        if (existingUserIndex === -1) {
          this.rooms[roomIndex].users.push(user);
          // console.log(
          //   'Utilisateurs dans cette chambre :',
          //   this.rooms[roomIndex].users,
          // );
          // console.log('Toutes les chambres :', this.rooms);

          this.server.to(roomName).emit('userJoined', user);
        } else {
          // console.log("L'utilisateur existe déjà dans cette chambre");
        }
      }
    }
  }

  afterInit(server: Server) {
    this.logger.log('Websocket server initialized');
  }
}

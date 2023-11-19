import { SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from "uuid";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Handle connection event
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection event
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(data)
    // Handle received message
    this.server.emit('message', data); // Broadcast the message to all connected clients
  }

  @SubscribeMessage('createRoom')
    handleCreateRoom(@MessageBody('selectedLetter') selectedLetter: any, @ConnectedSocket() client: Socket) {
      console.log(selectedLetter)
      const id = uuidv4();
      client.join(id);
      this.server.emit('roomCreated', { room: id, selectedLetter });
    }

    @SubscribeMessage('joinGame')
    handleStartGame(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket): void {
        //this.roomService.startGame(6);
        this.server.emit(roomId, 'gameStarted');
    }

    @SubscribeMessage('stopGame')
    handleStopGame(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket): void {
        //this.roomService.startGame(6);
        this.server.emit("stopGame", {stopGame: true});
    }
}
import { SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private roomPlayerMap: Map<string, Map<string, number>> = new Map();

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
      const id = "ticktickroom".concat(uuidv4());
      client.join(id);
      this.roomPlayerMap.set(id, new Map<string, number>());
      this.server.emit('roomCreated', { room: id, selectedLetter });
    }

    @SubscribeMessage('joinGame')
    handleStartGame(@MessageBody() message: any, @ConnectedSocket() client: Socket): void {

      if(this.roomPlayerMap.get(message.roomId) && this.roomPlayerMap.get(message.roomId).has(message.email)){
        this.server.emit(message.roomId, {status: 'playerExists'});
      }
      else{
        let roomPlayerResultMap = this.roomPlayerMap.get(message.roomId);
        roomPlayerResultMap.set(message.email, 0)
        this.roomPlayerMap.set(message.roomId, roomPlayerResultMap);
        this.server.emit(message.roomId, {status: 'playerJoined'});
      }
    }

    @SubscribeMessage('stopGame')
    handleStopGame(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket): void {
      console.log("stopping game")
        this.server.emit("stopGame", {stopGame: true});
    }

    @SubscribeMessage('collateResults')
    async handleCollateResults(@MessageBody() message: any, @ConnectedSocket() client: Socket): Promise<void> {
      let animalName = message.gameEntries.animalName.toLocaleLowerCase()
      let countryName = message.gameEntries.countryName.toLocaleLowerCase()
      let objectName = message.gameEntries.objectName.toLocaleLowerCase()
      let selectedIgnoreCase = message.selectedLetter.toLocaleLowerCase()
      let playerAnimalCatScore = await this.validateAnimalOrObject(animalName) && animalName.startsWith(selectedIgnoreCase) ? 1 : 0
      let countryNameScore = await this.validateCountry(countryName) && countryName.startsWith(selectedIgnoreCase) ? 1 : 0
      let objectNameScore = await this.validateAnimalOrObject(objectName) && objectName.startsWith(selectedIgnoreCase) ? 1 : 0
      console.log(this.roomPlayerMap)
      let roomPlayerResultMap = this.roomPlayerMap.get(message.roomId);
      roomPlayerResultMap.set(message.email, playerAnimalCatScore + countryNameScore + objectNameScore);
      this.roomPlayerMap.set(message.roomId, roomPlayerResultMap);
      console.log(this.roomPlayerMap.get(message.roomId))
      let result = Array.from(this.roomPlayerMap.get(message.roomId), ([email, score]) => ({ key: uuidv4(), email, score }))
      this.server.emit(message.roomId.concat("result"), {result});
    }

    private async validateCountry(countryName: string): Promise<boolean> {
      return axios.get("https://restcountries.com/v3.1/name/".concat(countryName)).then(
        res =>{
          if(res && res.data && res.data[0].name.common.toLocaleLowerCase().includes(countryName.toLocaleLowerCase())){
            return true
          }
          else{
            return false
          }
        }
      ).catch(err => {
        //console.log(err)
        return false
      })
    }

    private async validateAnimalOrObject(word: string): Promise<boolean> {
      return axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/".concat(word)).then(
        res =>{
          if(res && res.data && res.data[0].word){
            return true
          }
          else{
            return false
          }
        }
      ).catch(err => {
        //console.log(err)
        return false
      })
    }
}
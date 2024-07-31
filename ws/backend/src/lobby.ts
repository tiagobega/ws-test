import { v4 as uuidv4 } from 'uuid';
import { Player } from './player';

export interface LobbyOptions {
  initialConnection?: Player;
  connectionsLimit?: number;
}

export const lobbies: { [key: string]: Lobby } = {};

export class Lobby {
  public readonly connections: Player[] = [];
  public readonly id = uuidv4();

  private connectionsLimit = 32;

  constructor(private readonly options: LobbyOptions = {}) {
    this.options.connectionsLimit ??= 32;
    this.connectionsLimit = this.options.connectionsLimit;
  }

  isFull() {
    if (this.connections.length >= this.connectionsLimit) {
      return false;
    }
  }

  close() {
    this.connections.forEach((connection) => connection.disconnectFromLobby());
  }

  connectPlayer(player: Player) {
    const isFull = this.isFull();

    if (isFull) {
      return false;
    }

    this.connections.push(player);

    return true;
  }

  disconnectPlayer(player: Player) {
    let connection: Player;

    for (let i = 0; i < this.connections.length - 1; i++) {
      connection = this.connections[i];
      if (connection.userId !== player.userId) continue;

      this.connections.splice(i, 1);
      break;
    }
  }
}

function validateLobby() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('second(): called');
  };
}

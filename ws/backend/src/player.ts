import { v4 as uuidv4 } from 'uuid';
import { Lobby } from './lobby';
import { WebSocket } from 'ws';
import { PlayerData } from './constants/messages/player';

export type Vector3 = [number, number, number];
export type Quaternion = [number, number, number, number];

export interface PlayerOptions {
  initialPosition?: Vector3;
  initialRotation?: Quaternion;
  initialColor?: string;
}
export const players: { [key: string]: Player } = {};

export class Player {
  public readonly userId = uuidv4();
  public readonly position: Vector3;
  public readonly rotation: Quaternion;

  private color: string;
  private connected = false;
  private lobby: Lobby;

  constructor(
    public readonly socket: WebSocket,
    private readonly options: PlayerOptions = {}
  ) {
    this.options.initialColor ??= '#ffffff';
    this.options.initialRotation ??= [0, 0, 0, 0];
    this.options.initialPosition ??= [0, 0, 0];

    this.position = [...this.options.initialPosition];
    this.rotation = [...this.options.initialRotation];
    this.color = this.options.initialColor;
  }

  get currentLobby() {
    return this.lobby;
  }

  get isConnected() {
    return this.connected;
  }

  get currentColor() {
    return this.color;
  }

  get data(): PlayerData {
    return {
      color: this.currentColor,
      userId: this.userId,
      position: this.position,
      rotation: this.rotation,
    };
  }

  setColor(color: string) {
    this.color = color;
  }

  setPosition(position: Vector3) {
    this.position[0] = position[0];
    this.position[1] = position[1];
    this.position[2] = position[2];
  }

  setRotation(rotation: Quaternion) {
    this.rotation[0] = rotation[0];
    this.rotation[1] = rotation[1];
    this.rotation[2] = rotation[2];
    this.rotation[3] = rotation[3];
  }

  connectToLobby(lobby: Lobby) {
    const isConnected = lobby.connectPlayer(this);

    this.connected = isConnected;

    if (isConnected) {
      this.lobby = lobby;
    }

    return isConnected;
  }

  disconnectFromLobby() {
    this.lobby.disconnectPlayer(this);
    this.connected = false;
    this.lobby = undefined;
  }
}

function validatePlayer(player: Player) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('first(): called');
  };
}

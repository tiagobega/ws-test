import { WebSocket } from 'ws';
import { LOBBY_MESSAGE, LobbyMessage } from './lobby';
import { PLAYER_MESSAGE, PlayerMessage } from './player';
import { SOCKET_MESSAGE, SocketMessage } from './socket';

export const GAME_MESSAGE = {
  ...LOBBY_MESSAGE,
  ...SOCKET_MESSAGE,
  ...PLAYER_MESSAGE,
} as const;

export type GameMessageType = (typeof GAME_MESSAGE)[keyof typeof GAME_MESSAGE];

export type GameMessage = PlayerMessage | LobbyMessage | SocketMessage;
export type GameMessageHandler<TMessageType extends GameMessage = GameMessage> =
  (ws: WebSocket, data: TMessageType) => void;

import { type WebSocket } from 'ws';
import {
  GAME_MESSAGE,
  GameMessageHandler,
  GameMessageType,
  type GameMessage,
} from '../constants/messages';
import { createPlayer, deletePlayer, updatePlayer } from './player';
import { createLobby, exitLobby, joinLobby } from './lobby';

//TO-DO separate handlers for send(App) and receive(Game) message types

const lobbyHandlers = {
  [GAME_MESSAGE.LOBBY_CLOSE]: () => {},
  [GAME_MESSAGE.LOBBY_CREATE]: createLobby,
  [GAME_MESSAGE.LOBBY_EXIT]: exitLobby,
  [GAME_MESSAGE.LOBBY_JOIN]: joinLobby,

  [GAME_MESSAGE.LOBBY_WAS_CLOSED]: () => {},
  [GAME_MESSAGE.LOBBY_WAS_CREATED]: () => {},
  [GAME_MESSAGE.LOBBY_WAS_EXITED]: () => {},
  [GAME_MESSAGE.LOBBY_WAS_JOINED]: () => {},
};

const playerHandlers = {
  [GAME_MESSAGE.PLAYER_CREATE]: createPlayer,
  [GAME_MESSAGE.PLAYER_DELETE]: deletePlayer,
  [GAME_MESSAGE.PLAYER_UPDATE]: updatePlayer,
  [GAME_MESSAGE.PLAYER_WAS_CREATED]: () => {},
  [GAME_MESSAGE.PLAYER_WAS_DELETED]: () => {},
  [GAME_MESSAGE.PLAYER_WAS_UPDATED]: () => {},
};

const socketHandlers = {
  [GAME_MESSAGE.SOCKET_ERROR]: () => {},
  [GAME_MESSAGE.SOCKET_SIMPLE_MESSAGE]: () => {},
};

export const handlers: { [key in GameMessageType]: GameMessageHandler } = {
  ...lobbyHandlers,
  ...playerHandlers,
  ...socketHandlers,
};

export const messageHandler = (ws: WebSocket, data: GameMessage) => {
  if (data.type) {
    handlers[data.type]?.(ws, data);
    return;
  }
};

//TO-DO change GameMessage to AppMessage
export const messageSender = (ws: WebSocket, data: GameMessage) => {
  console.log('sending message:', data);
  const sendData = JSON.stringify(data);
  ws.send(sendData);
};

import {
  PLAYER_MESSAGE,
  PlayerDeleteMessage,
  PlayerUpdateMessage,
  type PlayerCreateMessage,
} from '../constants/messages/player';

import { GAME_MESSAGE, GameMessageHandler } from '../constants/messages';
import { Player, players } from '../player';
import { messageSender } from '.';

export const createPlayer: GameMessageHandler<PlayerCreateMessage> = (
  ws,
  data
) => {
  const player = new Player(ws, data.options);
  players[player.userId] = player;

  messageSender(ws, {
    type: PLAYER_MESSAGE.PLAYER_WAS_CREATED,
    ...player.data,
  });
};

export const deletePlayer: GameMessageHandler<PlayerDeleteMessage> = (
  ws,
  data
) => {
  delete players[data.userId];

  messageSender(ws, {
    type: PLAYER_MESSAGE.PLAYER_WAS_DELETED,
    userId: data.userId,
  });
};

export const updatePlayer: GameMessageHandler<PlayerUpdateMessage> = (
  ws,
  data
) => {
  const player = players[data.userId];

  if (!player) {
    //TO-DO: message trying to update an inexistent player
    return;
  }

  player.setPosition(data.position);
  player.setRotation(data.rotation);
  player.setColor(data.color);

  if (!player.isConnected) return;

  player.currentLobby.connections.forEach((connection) => {
    if (connection.userId === player.userId) return;

    messageSender(connection.socket, {
      type: GAME_MESSAGE.PLAYER_WAS_UPDATED,
      ...player.data,
    });
  });
};

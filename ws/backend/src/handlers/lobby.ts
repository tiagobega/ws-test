import { messageHandler, messageSender } from '.';
import { GameMessageHandler } from '../constants/messages';
import {
  LOBBY_MESSAGE,
  LobbyCreateMessage,
  LobbyExitMessage,
  LobbyJoinMessage,
} from '../constants/messages/lobby';
import { lobbies, Lobby } from '../lobby';
import { players } from '../player';

export const createLobby: GameMessageHandler<LobbyCreateMessage> = (
  ws,
  data
) => {
  const lobby = new Lobby();

  lobbies[lobby.id] = lobby;

  messageSender(ws, {
    type: LOBBY_MESSAGE.LOBBY_WAS_CREATED,
    lobbyId: lobby.id,
  });

  joinLobby(ws, {
    type: LOBBY_MESSAGE.LOBBY_JOIN,
    lobbyId: lobby.id,
    userId: data.userId,
  });
};

export const joinLobby: GameMessageHandler<LobbyJoinMessage> = (ws, data) => {
  const player = players[data.userId];
  const lobby = lobbies[data.lobbyId];

  if (!player) {
    //error about player validation
    return;
  }

  if (!lobby) {
    //error about lobby validation
    return;
  }

  const playerConnected = player.connectToLobby(lobby);

  if (playerConnected) {
    const lobbyPlayers = lobby.connections.map(({ data }) => data);

    messageSender(player.socket, {
      type: LOBBY_MESSAGE.LOBBY_WAS_JOINED,
      lobbyId: lobby.id,
      lobbyPlayers,
      ...player.data,
    });

    //send message to the lobby
    lobby.connections.forEach((connection) => {
      if (connection.userId === player.userId) return;

      messageSender(connection.socket, {
        type: LOBBY_MESSAGE.LOBBY_WAS_JOINED,
        lobbyId: lobby.id,
        lobbyPlayers,
        ...player.data,
      });
    });
  } else {
    //send error message to the player
  }
};

export const exitLobby: GameMessageHandler<LobbyExitMessage> = (ws, data) => {
  const player = players[data.userId];
  if (!player) {
    //error about player validation
  }

  if (!player.isConnected) {
    //error about not being connected
    return;
  }

  player.disconnectFromLobby();

  messageSender(ws, {
    type: LOBBY_MESSAGE.LOBBY_EXIT,
    userId: player.userId,
  });
};

import { PlayerData } from './player';

export const LOBBY_MESSAGE = {
  LOBBY_CLOSE: 'LOBBY_CLOSE',
  LOBBY_CREATE: 'LOBBY_CREATE',
  LOBBY_EXIT: 'LOBBY_EXIT',
  LOBBY_JOIN: 'LOBBY_JOIN',

  LOBBY_WAS_CREATED: 'LOBBY_WAS_CREATED',
  LOBBY_WAS_CLOSED: 'LOBBY_WAS_CLOSED',
  LOBBY_WAS_EXITED: 'LOBBY_WAS_EXITED',
  LOBBY_WAS_JOINED: 'LOBBY_WAS_JOINED',
} as const;

export type LobbyMessageType =
  (typeof LOBBY_MESSAGE)[keyof typeof LOBBY_MESSAGE];

export type LobbyCreateMessage = {
  type: typeof LOBBY_MESSAGE.LOBBY_CREATE;
  userId: string;
};

export type LobbyJoinMessage = {
  type: typeof LOBBY_MESSAGE.LOBBY_JOIN;
  lobbyId: string;
  userId: string;
};

export type LobbyExitMessage = {
  type: typeof LOBBY_MESSAGE.LOBBY_EXIT;
  userId: string;
};

export type LobbyCloseMessage = {
  type: typeof LOBBY_MESSAGE.LOBBY_CLOSE;
  userId: string;
};

export type LobbyWasCreatedMessage = {
  type: typeof LOBBY_MESSAGE.LOBBY_WAS_CREATED;
  lobbyId: string;
};

export type LobbyWasClosedMessage = {
  type: typeof LOBBY_MESSAGE.LOBBY_WAS_CLOSED;
  lobbyId: string;
};

export type LobbyWasExitedMessage = {
  type: typeof LOBBY_MESSAGE.LOBBY_WAS_EXITED;
  lobbyId: string;
};

export type LobbyWasJoinedMessage = {
  type: typeof LOBBY_MESSAGE.LOBBY_WAS_JOINED;
  lobbyId: string;
  lobbyPlayers?: PlayerData[];
} & PlayerData;

export type LobbyMessage =
  | LobbyCreateMessage
  | LobbyJoinMessage
  | LobbyExitMessage
  | LobbyCloseMessage
  | LobbyWasCreatedMessage
  | LobbyWasClosedMessage
  | LobbyWasExitedMessage
  | LobbyWasJoinedMessage;

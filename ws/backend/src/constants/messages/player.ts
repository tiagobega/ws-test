import {
  type Quaternion,
  type Vector3,
  type PlayerOptions,
} from 'backend/src/player';

export const PLAYER_MESSAGE = {
  PLAYER_CREATE: 'PLAYER_CREATE',
  PLAYER_DELETE: 'PLAYER_DELETE',
  PLAYER_UPDATE: 'PLAYER_UPDATE',

  PLAYER_WAS_CREATED: 'PLAYER_WAS_CREATED',
  PLAYER_WAS_UPDATED: 'PLAYER_WAS_UPDATED',
  PLAYER_WAS_DELETED: 'PLAYER_WAS_DELETED',
} as const;

export type PlayerData = {
  userId: string;
  position: Vector3;
  rotation: Quaternion;
  color: string;
};

export type PlayerCreateMessage = {
  type: typeof PLAYER_MESSAGE.PLAYER_CREATE;
  options: PlayerOptions;
};

export type PlayerDeleteMessage = {
  type: typeof PLAYER_MESSAGE.PLAYER_DELETE;
  userId: string;
};

export type PlayerUpdateMessage = {
  type: typeof PLAYER_MESSAGE.PLAYER_UPDATE;
} & PlayerData;

export type PlayerWasCreatedMessage = {
  type: typeof PLAYER_MESSAGE.PLAYER_WAS_CREATED;
} & PlayerData;

export type PlayerWasUpdatedMessage = {
  type: typeof PLAYER_MESSAGE.PLAYER_WAS_UPDATED;
} & PlayerData;

export type PlayerWasDeletedMessage = {
  type: typeof PLAYER_MESSAGE.PLAYER_WAS_DELETED;
  userId: string;
};

export type PlayerMessage =
  | PlayerCreateMessage
  | PlayerDeleteMessage
  | PlayerUpdateMessage
  | PlayerWasCreatedMessage
  | PlayerWasUpdatedMessage
  | PlayerWasDeletedMessage;

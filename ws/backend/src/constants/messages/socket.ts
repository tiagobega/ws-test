export const SOCKET_MESSAGE = {
  SOCKET_ERROR: 'SOCKET_ERROR',
  SOCKET_SIMPLE_MESSAGE: 'SOCKET_SIMPLE_MESSAGE',
} as const;

export type SocketSimpleMessage = {
  type: typeof SOCKET_MESSAGE.SOCKET_SIMPLE_MESSAGE;
  message: string;
};

export type SocketErrorMessage = {
  type: typeof SOCKET_MESSAGE.SOCKET_ERROR;
  message: string;
};

export type SocketMessage = SocketSimpleMessage | SocketErrorMessage;

import { useEffect, useRef, useState } from 'react';
import {
  GAME_MESSAGE,
  GameMessage,
} from '../../../../../backend/src/constants/messages/index';
import { useAnimation } from '../../contexts/animation';

const controls: { [key: string]: boolean } = {
  w: false,
  a: false,
  s: false,
  d: false,
};

const sendWsMessage = (ws: WebSocket, params: GameMessage) => {
  ws.send(JSON.stringify(params));
};

export const Game = () => {
  const { registerAnimation, unregisterAnimation } = useAnimation();

  const ws = useRef<WebSocket | null>(null);

  const playerId = useRef<string | null>(null);
  const lobbyId = useRef<string | null>(null);
  const [lobbyInput, setLobbyInput] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [messages, setMessages] = useState<string[]>([]);
  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);

  const gameBoardRef = useRef<HTMLDivElement>(null!);
  const playerDataRef = useRef<{
    [key: string]: {
      position: [number, number];
      color: string;
      colorNeedUpdate: boolean;
    };
  }>({});

  const addLog = (...args: string[]) =>
    setMessages((current) => [...current, ...args]);

  const handleCreateLobby = () => {
    if (!ws.current || !playerId.current) return;

    sendWsMessage(ws.current, {
      type: GAME_MESSAGE.LOBBY_CREATE,
      userId: playerId.current,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lobbyInput || !playerId.current) return;

    setLobbyInput('');

    if (ws.current) {
      sendWsMessage(ws.current, {
        type: GAME_MESSAGE.LOBBY_JOIN,
        userId: playerId.current,
        lobbyId: lobbyInput,
      });
    }
  };

  const handleDisconnectLobby = () => {
    lobbyId.current = '';

    if (ws.current && playerId.current) {
      sendWsMessage(ws.current, {
        type: GAME_MESSAGE.LOBBY_EXIT,
        userId: playerId.current,
      });
    }
  };

  useEffect(() => {
    if (ws.current) {
      ws.current.close();
    }

    const newWS = new WebSocket(`ws://localhost:3000`);
    ws.current = newWS;

    newWS.addEventListener('open', () => {
      addLog('connection established');

      sendWsMessage(newWS, {
        type: GAME_MESSAGE.PLAYER_CREATE,
        options: {
          initialPosition: [250, 250, 0],
          initialColor: '#ffffff',
        },
      });
    });

    newWS.addEventListener('close', () => {
      addLog('connection closed');
    });

    newWS.addEventListener('message', (msg: MessageEvent<string>) => {
      //TO-DO: trocar para store
      const data = JSON.parse(msg.data) as GameMessage;

      switch (data.type) {
        case GAME_MESSAGE.LOBBY_WAS_CREATED:
          {
            lobbyId.current = data.lobbyId;

            addLog('lobby created');
          }
          break;
        case GAME_MESSAGE.PLAYER_WAS_CREATED:
          {
            playerId.current = data.userId;

            playerDataRef.current = {
              [data.userId]: {
                position: [data.position[0], data.position[1]],
                color: data.color,
                colorNeedUpdate: false,
              },
            };
          }
          break;
        case GAME_MESSAGE.LOBBY_WAS_JOINED:
          {
            if (playerId.current === data.userId) {
              lobbyId.current = data.lobbyId;
              addLog('joined to lobby');
            } else {
              addLog('someone joined to lobby');
            }

            setCurrentPlayers(data.lobbyPlayers!.map(({ userId }) => userId));

            data.lobbyPlayers!.forEach((player) => {
              if (playerDataRef.current[player.userId]) {
                return;
              }

              playerDataRef.current[player.userId] = {
                position: [player.position[0], player.position[1]],
                color: player.color,
                colorNeedUpdate: false,
              };
            });
          }
          break;
        case GAME_MESSAGE.PLAYER_WAS_UPDATED:
          {
            if (playerId.current == data.userId) {
              return;
            }

            const updatedPlayer = playerDataRef.current[data.userId];

            addLog(
              `${updatedPlayer.position[0]}, ${updatedPlayer.position[1]}`
            );

            addLog('player was updated');

            if (updatedPlayer) {
              playerDataRef.current[data.userId] = {
                position: [data.position[0], data.position[1]],
                color: data.color,
                colorNeedUpdate: false,
              };
            }
          }
          break;
      }
    });

    function animate() {
      const userId = playerId.current;

      if (!userId) return;

      const myPLayer = playerDataRef.current[userId];

      if (!myPLayer) return;

      if (controls.w) {
        myPLayer.position[1] -= 2;
      }
      if (controls.s) {
        myPLayer.position[1] += 2;
      }
      if (controls.a) {
        myPLayer.position[0] -= 2;
      }
      if (controls.d) {
        myPLayer.position[0] += 2;
      }

      myPLayer.position[1] = Math.min(
        Math.max(13, myPLayer.position[1]),
        500 - 13
      );

      myPLayer.position[0] = Math.min(
        Math.max(13, myPLayer.position[0]),
        500 - 13
      );

      if (
        (controls.w ||
          controls.s ||
          controls.a ||
          controls.d ||
          myPLayer.colorNeedUpdate) &&
        ws.current
      ) {
        sendWsMessage(ws.current, {
          type: GAME_MESSAGE.PLAYER_UPDATE,
          rotation: [0, 0, 0, 0],
          position: [
            myPLayer.position[0],
            myPLayer.position[1],
            0,
          ],
          color: myPLayer.color,
          userId,
        });
      }

      Object.keys(playerDataRef.current).forEach((id) => {
        const playerData = playerDataRef.current[id];

        if (!playerData) return;

        const element = document.getElementById(`${id}`) as HTMLDivElement;

        if (!element) return;

        element.style.left = `${playerData.position[0]}px`;
        element.style.top = `${playerData.position[1]}px`;
        element.style.backgroundColor = `${playerData.color}`;
      });
    }

    registerAnimation(animate);

    return () => {
      newWS.close();
      unregisterAnimation(animate);
    };
  }, []);

  useEffect(() => {
    if (!lobbyId.current) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (controls[e.key] === undefined) return;
      controls[e.key] = true;
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (controls[e.key] === undefined) return;
      controls[e.key] = false;
    }

    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.addEventListener('keydown', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lobbyId.current]);

  return (
    <main className="game">
      {!lobbyId.current && (
        <div className="game__connect">
          <button onClick={handleCreateLobby}>Create lobby</button>
          <span>or</span>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              onChange={(e) => setLobbyInput(e.target.value)}
              value={lobbyInput}
            />

            <button type="submit">Join lobby</button>
          </form>
        </div>
      )}

      {lobbyId.current && (
        <>
          <div className="game__info">
            <p>Player Id: {playerId.current}</p>
            <div className="game__info__lobby">
              <p>Lobby id: {lobbyId.current}</p>
              <button onClick={handleDisconnectLobby}>Exit lobby</button>
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(lobbyId.current!);
                }}
              >
                Copy lobby
              </button>
            </div>

            <div className="game__info__color">
              <label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    if (playerId.current) {
                      setColor(e.target.value);
                      playerDataRef.current[playerId.current].color =
                        e.target.value;
                      playerDataRef.current[playerId.current].colorNeedUpdate;
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </>
      )}

      <div
        className={`game__board ${
          lobbyId.current ? 'game__board--visible' : ''
        }`}
        ref={gameBoardRef}
      >
        {currentPlayers.map((playerId) => {
          return (
            <div className="game__board__player" id={playerId} key={playerId} />
          );
        })}
      </div>

      <div className="game__log">
        <div className="game__log__wrapper">
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
      </div>
    </main>
  );
};

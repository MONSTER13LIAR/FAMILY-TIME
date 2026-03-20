import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header';
import BackgroundDecor from './components/BackgroundDecor';
import Landing from './components/Landing';
import Lobby from './components/Lobby';
import NameInput from './components/NameInput';
import Room from './components/Room';
import Game from './components/Game';
import Voting from './components/Voting';
import Results from './components/Results';
import { sounds } from './utils/soundManager';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const socket = io(socketUrl, {
  transports: ["websocket"], // Priority to websocket for production
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000
});

function App() {
  const [screen, setScreen] = useState('landing');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [myPlayerId, setMyPlayerId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [maxPlayers, setMaxPlayers] = useState(10);

  // Game state
  const [word, setWord] = useState('');
  const [impostorId, setImpostorId] = useState('');
  const [turnIndex, setTurnIndex] = useState(0);
  const [hints, setHints] = useState([]);
  const [votes, setVotes] = useState({});
  const [isTie, setIsTie] = useState(false);
  const [hasMajority, setHasMajority] = useState(true);
  const [topVoteCount, setTopVoteCount] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [pointGains, setPointGains] = useState({});
  const [gameState, setGameState] = useState('waiting');
  const [roundEnded, setRoundEnded] = useState(false);
  const [votingPhase, setVotingPhase] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [turnStartTime, setTurnStartTime] = useState(null);

  // Handle session persistence + Reconnect rejoining
  useEffect(() => {
    const handleRejoin = () => {
      const saved = localStorage.getItem('session');
      if (saved) {
        try {
          const session = JSON.parse(saved);
          if (session && typeof session === 'object') {
            const { roomCode: savedCode, playerName: savedName } = session;
            if (savedCode && savedName) {
              setRoomCode(savedCode);
              setPlayerName(savedName);
              socket.emit('rejoin_room', { roomCode: savedCode, playerName: savedName });
            }
          }
        } catch (e) { }
      }
    };

    socket.on('connect', handleRejoin);
    handleRejoin(); // Check on mount too

    return () => socket.off('connect', handleRejoin);
  }, []);

  // Register socket listeners ONCE
  useEffect(() => {
    socket.on('connect', () => {
      setMyPlayerId(socket.id);
    });

    socket.on('room_joined', ({ roomCode: joinedCode, isHost: hostStatus, maxPlayers: mp }) => {
      setRoomCode(joinedCode);
      setIsHost(hostStatus);
      setMaxPlayers(mp || 10);
      setScreen('room');

      // Save session
      let savedName = playerName;
      if (!savedName) {
        try {
          savedName = JSON.parse(localStorage.getItem('session') || '{}').playerName;
        } catch (e) {
          savedName = null;
        }
      }
      if (savedName) {
        localStorage.setItem('session', JSON.stringify({ roomCode: joinedCode, playerName: savedName }));
      }
    });

    socket.on('update_players', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('game_started', () => {
      setWord('');
      setImpostorId('');
      setTurnIndex(0);
      setHints([]);
      setVotes({});
      setPointGains({});
      sounds.start();
      setScreen('game');
    });

    socket.on('assign_role', ({ word, isImpostor }) => {
      setWord(word);
      if (isImpostor) {
        setImpostorId(socket.id);
      }
    });

    socket.on('update_game_state', ({ gameState: gs, currentTurnIndex, hints, votes, roundEnded: re, votingPhase: vp, timerEnabled: te, turnStartTime: tst }) => {
      setGameState(gs);
      if (re !== undefined) setRoundEnded(re);
      if (vp !== undefined) setVotingPhase(vp);
      if (te !== undefined) setTimerEnabled(te);
      if (tst !== undefined) setTurnStartTime(tst);
      setTurnIndex(prev => {
        if (prev !== currentTurnIndex) sounds.turn();
        return currentTurnIndex;
      });
      setHints(hints);
      setVotes(votes);

      // Sync screen based on game state
      if (gs === 'playing' || gs === 'round_complete') {
        setScreen('game');
      } else if (gs === 'voting') {
        setScreen('voting');
      } else if (gs === 'results') {
        setScreen('results');
      } else if (gs === 'waiting') {
        setScreen('room');
      }
    });

    socket.on('start_voting', () => {
      sounds.vote();
      setScreen('voting');
    });

    socket.on('show_results', ({ impostorId, word, votes, pointGains, isTie, hasMajority, topVoteCount, totalVotes }) => {
      setImpostorId(impostorId);
      setWord(word);
      if (votes) setVotes(votes);
      if (pointGains) setPointGains(pointGains);
      setIsTie(isTie || false);
      setHasMajority(hasMajority !== false);
      setTopVoteCount(topVoteCount || 0);
      setTotalVotes(totalVotes || 0);
      sounds.result();
      setScreen('results');
    });

    socket.on('error', (message) => {
      sounds.error();
      if (message === 'Player not found in this room' || message === 'Room not found') {
        localStorage.removeItem('session');
        setScreen('landing');
      }
      alert(message);
    });

    return () => {
      socket.off('connect');
      socket.off('room_joined');
      socket.off('update_players');
      socket.off('game_started');
      socket.off('assign_role');
      socket.off('update_game_state');
      socket.off('start_voting');
      socket.off('show_results');
      socket.off('error');
    };
  }, [playerName]); // Re-register if name changes to capture it for localStorage

  const handleStartFromLanding = () => setScreen('lobby');

  const handleCreateRoom = () => {
    setScreen('name');
    setIsHost(true);
  };

  const handleJoinRoom = (code) => {
    setRoomCode(code);
    setIsHost(false);
    setScreen('name');
  };

  const handleNameContinue = (name, options) => {
    setPlayerName(name);
    if (isHost) {
      const { maxPlayers, enableTimer } = options;
      socket.emit('create_room', { name, maxPlayers, enableTimer });
    } else {
      socket.emit('join_room', { code: roomCode, name });
    }
  };

  const handleExitRoom = () => {
    sounds.click();
    socket.emit('leave_room', roomCode);
    localStorage.removeItem('session');
    setRoomCode('');
    setPlayerName('');
    setIsHost(false);
    setPlayers([]);
    setScreen('landing');
  };

  const handleAddBot = () => {
    sounds.click();
    socket.emit('add_bot', roomCode);
  };

  const handleStartGame = () => {
    sounds.click();
    socket.emit('start_game', roomCode);
  };

  const handleProvideHint = (hint) => {
    sounds.click();
    socket.emit('submit_hint', { roomCode, hint });
  };

  const handleStartVoting = () => {
    sounds.click();
    socket.emit('start_voting', roomCode);
  };

  const handleVote = (votedId) => {
    sounds.click();
    socket.emit('submit_vote', { roomCode, votedId });
  };

  const handleNextRoundHints = () => {
    sounds.click();
    socket.emit('next_round_hints', roomCode);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500/30 font-sans scroll-smooth">
      <BackgroundDecor />
      <Header
        onExitRoom={handleExitRoom}
        inRoom={['room', 'game', 'voting', 'results'].includes(screen)}
        isGameActive={gameState !== 'waiting'}
      />

      {screen === 'landing' && <Landing onStart={handleStartFromLanding} />}
      {screen === 'lobby' && <Lobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} onBack={() => setScreen('landing')} />}
      {screen === 'name' && <NameInput isHost={isHost} onContinue={handleNameContinue} onBack={() => setScreen('lobby')} />}

      {screen === 'room' && (
        <Room
          roomCode={roomCode}
          isHost={isHost}
          players={players}
          myPlayerId={socket.id}
          maxPlayers={maxPlayers}
          onStartGame={handleStartGame}
          onLeave={handleExitRoom}
          onAddBot={handleAddBot}
        />
      )}

      {screen === 'game' && (
        <Game
          players={players}
          myPlayerId={socket.id}
          isHost={isHost}
          word={word}
          isImpostor={socket.id === impostorId}
          turnIndex={turnIndex}
          hints={hints}
          gameState={gameState}
          onProvideHint={handleProvideHint}
          onStartVoting={handleStartVoting}
          onNextRoundHints={handleNextRoundHints}
          timerEnabled={timerEnabled}
          turnStartTime={turnStartTime}
        />
      )}

      {screen === 'voting' && (
        <Voting
          players={players}
          myPlayerId={socket.id}
          hints={hints}
          hasVoted={!!votes[socket.id]}
          onVote={handleVote}
        />
      )}

      {screen === 'results' && (
        <Results
          players={players}
          impostorId={impostorId}
          word={word}
          votes={votes}
          pointGains={pointGains}
          isHost={isHost}
          isTie={isTie}
          hasMajority={hasMajority}
          topVoteCount={topVoteCount}
          totalVotes={totalVotes}
          onNextRound={handleStartGame}
          roundEnded={roundEnded}
        />
      )}

      {/* Defensive Fallback for invalid screen states */}
      {!['landing', 'lobby', 'name', 'room', 'game', 'voting', 'results'].includes(screen) && (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center relative z-10">
          <h2 className="text-4xl font-black mb-6">Something went wrong</h2>
          <div className="flex gap-4">
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">Reload</button>
            <button onClick={() => handleExitRoom()} className="px-8 py-4 bg-slate-800 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">Go Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

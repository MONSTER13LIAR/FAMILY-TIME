const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST"]
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

const WORDS = [
  // Animals
  "Lion", "Tiger", "Elephant", "Giraffe", "Penguin", "Zebra", "Kangaroo", "Monkey", "Dolphin", "Whale",
  "Shark", "Octopus", "Butterfly", "Eagle", "Owl", "Snake", "Frog", "Horse", "Panda", "Koala",
  // Food
  "Pizza", "Burger", "Pasta", "Sushi", "Taco", "Pancake", "Waffle", "Ice Cream", "Chocolate", "Donut",
  "Cookie", "Sandwich", "Salad", "Steak", "Cheese", "Bread", "Muffin", "Bacon", "Waffles", "Burrito",
  // Objects
  "Computer", "Smartphone", "Guitar", "Piano", "Telescope", "Camera", "Umbrella", "Backpack", "Watch", "Key",
  "Bicycle", "Sunglasses", "Mirror", "Hammer", "Flashlight", "Compass", "Globe", "Battery", "Matches", "Clock",
  // Places
  "School", "Hospital", "Airport", "Library", "Museum", "Cinema", "Stadium", "Restaurant", "Hotel", "Bank",
  "Park", "Beach", "Forest", "Mountain", "Desert", "Island", "Cave", "Bridge", "Castle", "Pyramid",
  // Activities
  "Running", "Swimming", "Dancing", "Singing", "Cooking", "Painting", "Reading", "Writing", "Fishing", "Hiking",
  "Cycling", "Driving", "Flying", "Sleeping", "Eating", "Drinking", "Talking", "Laughing", "Walking", "Jumping",
  // Abstract/Misc
  "Rocket", "Satellite", "Submarine", "Helicopter", "Dragon", "Unicorn", "Vampire", "Zombie", "Robot", "Alien",
  "Ninja", "Wizard", "Knight", "Pirate", "Cowboy", "Mermaid", "Ghost", "Monster", "Superhero", "Detective"
];

const rooms = {};

const createPlayer = (id, name, isHost = false) => ({
  id,
  name,
  score: 0,
  isHost,
  isImpostor: false,
  isBot: false,
  isPlayingThisRound: true,
  isDisconnected: false
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', ({ name, maxPlayers }) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms[roomCode] = {
      roomCode,
      maxPlayers: maxPlayers || 10,
      players: [createPlayer(socket.id, name, true)],
      hostId: socket.id,
      gameState: 'waiting',
      word: '',
      usedWords: [],
      usedImpostors: [],
      currentTurnIndex: 0,
      hints: [],
      votes: {},
      roundEnded: false, // Part 1: State flag
      votingPhase: false // Part 1: State flag
    };
    
    socket.join(roomCode);
    socket.emit('room_joined', { roomCode, isHost: true, maxPlayers: rooms[roomCode].maxPlayers });
    io.to(roomCode).emit('update_players', rooms[roomCode].players);
  });

  socket.on('join_room', ({ code, name }) => {
    const roomCode = code.toUpperCase();
    if (rooms[roomCode]) {
      const room = rooms[roomCode];
      if (room.players.length >= room.maxPlayers) {
        return socket.emit('error', 'Room is full');
      }

      const newPlayer = createPlayer(socket.id, name);
      
      if (room.gameState !== 'waiting' && room.gameState !== 'results') {
         newPlayer.isPlayingThisRound = false; // Spectator for this round
      }

      room.players.push(newPlayer);
      socket.join(roomCode);
      socket.emit('room_joined', { roomCode, isHost: false, maxPlayers: room.maxPlayers });
      io.to(roomCode).emit('update_players', room.players);

      if (room.gameState !== 'waiting') {
         socket.emit('game_started');
         socket.emit('update_game_state', {
            gameState: room.gameState,
            currentTurnIndex: room.currentTurnIndex,
            hints: room.hints,
            votes: room.votes
         });
         socket.emit('assign_role', { word: '', isImpostor: false });
         if (room.gameState === 'results') {
           const impostor = room.players.find(p => p.isImpostor);
           socket.emit('show_results', {
             impostorId: impostor ? impostor.id : null,
             word: room.word
           });
         }
      }
    } else {
      socket.emit('error', 'Room not found');
    }
  });
  
  socket.on('add_bot', (roomCode) => {
     const room = rooms[roomCode];
     if (room && room.hostId === socket.id) {
       if (room.players.length >= room.maxPlayers) {
          return socket.emit('error', 'Room is full');
       }
       const botNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley'];
       const bname = botNames[Math.floor(Math.random() * botNames.length)] + Math.floor(Math.random() * 100);
       const botId = 'bot_' + Math.random().toString(36).substring(2, 9);
       
       const newBot = createPlayer(botId, bname);
       newBot.isBot = true;
       if (room.gameState !== 'waiting' && room.gameState !== 'results') {
           newBot.isPlayingThisRound = false;
       }
       
       room.players.push(newBot);
       io.to(roomCode).emit('update_players', room.players);
     }
  });

  socket.on('rejoin_room', ({ roomCode, playerName }) => {
    const room = rooms[roomCode];
    if (room) {
      const player = room.players.find(p => p.name === playerName);
      if (player) {
        // Update player ID and rejoin room
        player.id = socket.id;
        player.isDisconnected = false;
        socket.join(roomCode);
        
        // If there are no other humans, may need to reassign host
        if (room.hostId === player.id || !room.players.some(p => p.id === room.hostId && !p.isBot)) {
           room.hostId = socket.id;
           player.isHost = true;
        }

        // Sync state back to rejoining player
        socket.emit('room_joined', { roomCode, isHost: player.isHost, maxPlayers: room.maxPlayers });
        io.to(roomCode).emit('update_players', room.players);
        
        if (room.gameState !== 'waiting') {
           socket.emit('game_started');
           socket.emit('update_game_state', {
              gameState: room.gameState,
              currentTurnIndex: room.currentTurnIndex,
              hints: room.hints,
              votes: room.votes
           });
           
           if (room.gameState === 'playing' || room.gameState === 'round_complete') {
             socket.emit('assign_role', {
                word: player.isImpostor ? '' : room.word,
                isImpostor: player.isImpostor
             });
           }
           
           if (room.gameState === 'results' && room.lastResults) {
             socket.emit('show_results', room.lastResults);
           }
        }
      } else {
        socket.emit('error', 'Player not found in this room');
      }
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('start_voting', (roomCode) => {
    const room = rooms[roomCode];
    const playingPlayers = getPlayingPlayers(roomCode);
    
    if (room && room.hostId === socket.id && (room.gameState === 'playing' || room.gameState === 'round_complete')) {
      if (room.hints.length >= playingPlayers.length) {
        room.gameState = 'voting';
        room.votingPhase = true;
        room.roundEnded = false;
        io.to(roomCode).emit('start_voting');
        handleBotVotes(roomCode);
      }
    }
  });

  socket.on('start_game', (roomCode) => {
    const room = rooms[roomCode];
    if (room && room.hostId === socket.id) {
      // Pick a random word that hasn't been used in this room's session
      let availableWords = WORDS.filter(w => !room.usedWords.includes(w));
      
      // If all words are used, reset
      if (availableWords.length === 0) {
        room.usedWords = [];
        availableWords = [...WORDS];
      }

      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      room.word = randomWord;
      room.usedWords.push(randomWord);
      room.gameState = 'playing';
      room.roundEnded = false;
      room.votingPhase = false;
      room.currentTurnIndex = 0;
      room.hints = [];
      room.votes = {};

      // Preserve host status but shuffle turn order
      const hostPlayer = room.players.find(p => p.isHost);
      // Shuffle logic
      room.players.sort(() => Math.random() - 0.5);
      
      // Requirement 1: Fair Impostor Rotation
      // 1. eligiblePlayers = players who are NOT in usedImpostors
      let eligiblePlayers = room.players.filter(p => !room.usedImpostors.includes(p.name));

      // 2. If eligiblePlayers is empty (all players have been impostor once): Reset usedImpostors = []
      if (eligiblePlayers.length === 0) {
        room.usedImpostors = [];
        eligiblePlayers = [...room.players];
      }

      // 3. Randomly select impostor from eligiblePlayers
      const selectedImpostor = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];

      // 4. Update isImpostor for all players
      room.players.forEach(p => {
        p.isImpostor = (p === selectedImpostor);
        p.isPlayingThisRound = true;
      });

      // 5. Add selected player to usedImpostors
      room.usedImpostors.push(selectedImpostor.name);

      io.to(roomCode).emit('update_players', room.players);
      io.to(roomCode).emit('game_started');

      room.players.forEach(p => {
        if (!p.isBot) {
          io.to(p.id).emit('assign_role', {
            word: p.isImpostor ? '' : room.word,
            isImpostor: p.isImpostor
          });
        }
      });
      
      io.to(roomCode).emit('update_game_state', {
         gameState: room.gameState,
         currentTurnIndex: room.currentTurnIndex,
         hints: room.hints,
         votes: room.votes,
         roundEnded: room.roundEnded,
         votingPhase: room.votingPhase
      });
      
      handleBotTurn(roomCode);
    }
  });

  const getPlayingPlayers = (roomCode) => {
     if (!rooms[roomCode]) return [];
     return rooms[roomCode].players.filter(p => p.isPlayingThisRound);
  };

  const handleBotTurn = (roomCode) => {
      const room = rooms[roomCode];
      if (!room || room.gameState !== 'playing') return;
      
      const playingPlayers = getPlayingPlayers(roomCode);
      const turnPlayer = room.players[room.currentTurnIndex];
      
      if (turnPlayer && turnPlayer.isBot && turnPlayer.isPlayingThisRound) {
          setTimeout(() => {
              if (rooms[roomCode].gameState !== 'playing') return;
              const botHints = ['Cool', 'Good', 'Big', 'Small', 'Heavy', 'Light', 'Red', 'Blue'];
              const h = botHints[Math.floor(Math.random() * botHints.length)];
              rooms[roomCode].hints.push({ playerId: turnPlayer.id, hint: h });
              if (rooms[roomCode].hints.length % playingPlayers.length === 0) {
                  // End of a round
                  rooms[roomCode].currentTurnIndex = 0;
                  rooms[roomCode].gameState = 'round_complete';
                  console.log(`Round ${rooms[roomCode].hints.length / playingPlayers.length} finished in ${roomCode}. Waiting for next hint or voting...`);
              }
              
              // Find next playing player (skipping spectators)
              while(rooms[roomCode].players[rooms[roomCode].currentTurnIndex] && !rooms[roomCode].players[rooms[roomCode].currentTurnIndex].isPlayingThisRound) {
                  rooms[roomCode].currentTurnIndex++;
                  if (rooms[roomCode].currentTurnIndex >= rooms[roomCode].players.length) {
                      rooms[roomCode].currentTurnIndex = 0;
                  }
              }

              io.to(roomCode).emit('update_game_state', {
                  gameState: rooms[roomCode].gameState,
                  currentTurnIndex: rooms[roomCode].currentTurnIndex,
                  hints: rooms[roomCode].hints,
                  votes: rooms[roomCode].votes
              });
              
              handleBotTurn(roomCode);
          }, 1500);
      } else if (turnPlayer && !turnPlayer.isPlayingThisRound) {
          // Skip spectator in turn order (should not happen since index goes up to playing length, 
          // but just in case, advance)
          rooms[roomCode].currentTurnIndex++;
          handleBotTurn(roomCode);
      }
  };
  
  const handleBotVotes = (roomCode) => {
      const room = rooms[roomCode];
      if (!room || room.gameState !== 'voting') return;
      const playingPlayers = getPlayingPlayers(roomCode);

      setTimeout(() => {
          let updated = false;
          playingPlayers.forEach(p => {
              if (p.isBot && !room.votes[p.id]) {
                  const others = playingPlayers.filter(pl => pl.id !== p.id);
                  room.votes[p.id] = others[Math.floor(Math.random() * others.length)].id;
                  updated = true;
              }
          });
          if (updated) {
              // Hide votes from players until results
              const maskedVotes = { ...room.votes };
              
              io.to(roomCode).emit('update_game_state', {
                  gameState: room.gameState,
                  currentTurnIndex: room.currentTurnIndex,
                  hints: room.hints,
                  votes: maskedVotes
              });
              checkVotingComplete(roomCode);
          }
      }, 2000);
  };

  socket.on('submit_hint', ({ roomCode, hint }) => {
    const room = rooms[roomCode];
    const playingPlayers = getPlayingPlayers(roomCode);
    
    if (room && room.gameState === 'playing') {
      const currentPlayer = room.players[room.currentTurnIndex];
      if (currentPlayer && currentPlayer.id === socket.id && currentPlayer.isPlayingThisRound) {
        room.hints.push({ playerId: socket.id, hint });
        room.currentTurnIndex++;
        if (room.currentTurnIndex >= room.players.length) {
           room.currentTurnIndex = 0;
           room.gameState = 'round_complete';
        }

        while(room.players[room.currentTurnIndex] && !room.players[room.currentTurnIndex].isPlayingThisRound) {
           room.currentTurnIndex++;
           if (room.currentTurnIndex >= room.players.length) {
             room.currentTurnIndex = 0;
             room.gameState = 'round_complete';
           }
        }
        
        io.to(roomCode).emit('update_game_state', {
           gameState: room.gameState,
           currentTurnIndex: room.currentTurnIndex,
           hints: room.hints,
           votes: room.votes,
           roundEnded: room.roundEnded,
           votingPhase: room.votingPhase
        });

        // Continue to bot if applicable (now infinite recursion is safe due to timer in handleBotTurn)
        handleBotTurn(roomCode);
      }
    }
  });

  socket.on('next_round_hints', (roomCode) => {
    const room = rooms[roomCode];
    if (room && room.hostId === socket.id && room.gameState === 'round_complete') {
      room.gameState = 'playing';
      room.currentTurnIndex = 0;
      io.to(roomCode).emit('update_game_state', {
         gameState: room.gameState,
         currentTurnIndex: room.currentTurnIndex,
         hints: room.hints,
         votes: room.votes
      });
      handleBotTurn(roomCode);
    }
  });

  const checkVotingComplete = (roomCode) => {
      const room = rooms[roomCode];
      if (!room || room.gameState !== 'voting') return;
      const playingPlayers = getPlayingPlayers(roomCode);
      if (Object.keys(room.votes).length === playingPlayers.length) {
          finishRound(roomCode);
      }
  };

  socket.on('submit_vote', ({ roomCode, votedId }) => {
    const room = rooms[roomCode];
    const player = room?.players.find(p => p.id === socket.id);
    if (room && room.gameState === 'voting' && player && player.isPlayingThisRound) {
      room.votes[socket.id] = votedId;
      io.to(roomCode).emit('update_game_state', {
         gameState: room.gameState,
         currentTurnIndex: room.currentTurnIndex,
         hints: room.hints,
         votes: room.votes
      });
      checkVotingComplete(roomCode);
    }
  });

  const finishRound = (roomCode) => {
      const room = rooms[roomCode];
      const playingPlayers = getPlayingPlayers(roomCode);
      const impostor = playingPlayers.find(p => p.isImpostor);
      
      const totalVotes = Object.values(room.votes).length;
      const voteCounts = {};
      Object.values(room.votes).forEach(vid => {
         voteCounts[vid] = (voteCounts[vid] || 0) + 1;
      });
      
      let maxV = 0;
      let votedOutIds = [];
      Object.entries(voteCounts).forEach(([vid, count]) => {
        if (count > maxV) {
          maxV = count;
          votedOutIds = [vid];
        } else if (count === maxV) {
          votedOutIds.push(vid);
        }
      });

      // Strict majority required: must have MORE than half votes AND no tie
      const hasMajority = maxV > totalVotes / 2;
      const impostorVotes = impostor ? (voteCounts[impostor.id] || 0) : 0;
      
      // Impostor voted out ONLY if they got a strict majority and it's not a tie
      const impostorVotedOut = impostor 
        ? (hasMajority && votedOutIds.length === 1 && votedOutIds.includes(impostor.id)) 
        : false;
      
      // User's specific rules:
      // 1. No one votes for impostor -> Impostor won
      // 2. Some votes but no majority -> Tie
      const isTie = !impostorVotedOut && impostorVotes > 0;
      
      const pointGains = {}; // { playerId: { points: number, reason: string } }

      // SCORING LOGIC - New Nuanced System
      if (impostor) {
        const correctVoters = playingPlayers.filter(p => !p.isImpostor && room.votes[p.id] === impostor.id);
        const incorrectVoters = playingPlayers.filter(p => !p.isImpostor && room.votes[p.id] !== impostor.id);
        const allVotedCorrectly = (incorrectVoters.length === 0);

        if (impostorVotedOut) {
          if (allVotedCorrectly) {
            // CASE 1: ALL players vote the impostor correctly
            correctVoters.forEach(voter => {
              voter.score += 20;
              pointGains[voter.id] = { points: 20, reason: "Unanimous!" };
            });
            // Impostor gets 0
          } else {
            // CASE 2: Impostor is correctly identified BUT not unanimously
            correctVoters.forEach(voter => {
              voter.score += 20;
              pointGains[voter.id] = { points: 20, reason: "Voted Correctly" };
            });
            // incorrectVoters get 0 points
            impostor.score += 6; // SMALL points (30% of 20)
            pointGains[impostor.id] = { points: 6, reason: "Deceived Some" };
          }
        } else {
          // CASE 3: Impostor is NOT caught
          impostor.score += 20;
          pointGains[impostor.id] = { points: 20, reason: "Undetected!" };
          // All other players receive 0 points
        }
      }

      room.gameState = 'results';
      room.roundEnded = true;
      room.votingPhase = false;
      room.lastResults = {
        impostorId: impostor ? impostor.id : null,
        word: room.word,
        votes: { ...room.votes },
        pointGains: { ...pointGains },
        isTie,
        hasMajority,
        topVoteCount: maxV,
        totalVotes
      };
      
      io.to(roomCode).emit('update_game_state', {
         gameState: room.gameState,
         currentTurnIndex: room.currentTurnIndex,
         hints: room.hints,
         votes: room.votes,
         roundEnded: room.roundEnded,
         votingPhase: room.votingPhase
      });
      io.to(roomCode).emit('show_results', room.lastResults);
      io.to(roomCode).emit('update_players', room.players);
  };

  socket.on('leave_room', (roomCode) => {
    const room = rooms[roomCode];
    if (room) {
      // Requirement 2: No leaving mid-game
      if (room.gameState !== 'waiting') {
        return socket.emit('error', 'Cannot leave during an active game session.');
      }
      
      socket.leave(roomCode);
      room.players = room.players.filter(p => p.id !== socket.id);
      io.to(roomCode).emit('update_players', room.players);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex > -1) {
        const player = room.players[playerIndex];
        // Part 4: Prevent Room Loss
        // Only delete in waiting if it's really the last person
        if (room.gameState === 'waiting') {
          room.players.splice(playerIndex, 1);
          io.to(roomCode).emit('update_players', room.players);
          
          const remainingHumans = room.players.filter(p => !p.isBot).length;
          if (remainingHumans === 0) {
            delete rooms[roomCode];
          }
        } else {
          // In active game, keep them but mark as disconnected
          player.isDisconnected = true;
          io.to(roomCode).emit('update_players', room.players);
        }
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO Server running on port ${PORT}`);
});


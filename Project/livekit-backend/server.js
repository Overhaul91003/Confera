const express = require('express');
const { AccessToken, RoomServiceClient } = require('livekit-server-sdk');
const { EgressClient, EncodedFileOutput } = require('livekit-server-sdk');  // ← new line
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config({ path: '.env' });

const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize LiveKit Room Service
const livekitHost = process.env.LIVEKIT_HOST;
const roomService = new RoomServiceClient(
  livekitHost,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

// NEW

// ——— NEW: Initialize Egress client ———
const egressClient = new EgressClient(
  process.env.LIVEKIT_HOST,            // e.g. http://localhost:7880
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);


// in‑memory map to keep track of recordings by room
const activeRecordings = {};
// ————————————————————————————————

// NEW


/**
 * ✅ Route to Create a Room
 */
app.post('/createRoom', async (req, res) => {
  try {
    const { roomName } = req.body;

    if (!roomName) {
      return res.status(400).json({ error: 'Missing roomName' });
    }

    // Check if the room already exists
    const existingRooms = await roomService.listRooms();
    const roomExists = existingRooms.some((room) => room.name === roomName);

    if (roomExists) {
      return res.status(409).json({ error: 'Room already exists' });
    }

    // Create the room
    const opts = {
      name: roomName,
      emptyTimeout: 10 * 60, // Room is deleted after 10 min of inactivity
      maxParticipants: 20,
    };

    await roomService.createRoom(opts);

    res.json({ message: `Room '${roomName}' created successfully`, roomName });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * ✅ Route to Get Token (Only If Room Exists)
 */
app.get('/getToken', async (req, res) => {
  try {
    const { roomName, participantName } = req.query;

    if (!roomName || !participantName) {
      return res.status(400).json({ error: 'Missing roomName or participantName' });
    }

    // Check if room exists
    const existingRooms = await roomService.listRooms();
    const roomExists = existingRooms.some((room) => room.name === roomName);

    if (!roomExists) {
      return res.status(404).json({ error: 'Room does not exist' });
    }

    // Generate token
    // 1️⃣ Build a collision‑free internal identity
    const uniqueId = `${participantName}-${Date.now()}`;   // e.g. "Aditya-1713672901234"

    // 2️⃣ Create token with metadata for display
    const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
      {
        identity: uniqueId,        // unique key for LiveKit routing
        name: participantName,  // your “Aditya” name in the UI
        ttl: '10m',
      }
    );

    at.addGrant({
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      room: roomName,
    });

    const token = await at.toJwt();
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * ✅ Route to List Active Rooms (With Participant Count)
 */
app.get('/rooms', async (req, res) => {
  try {
    const rooms = await roomService.listRooms();
    const formattedRooms = rooms.map((room) => ({
      name: room.name,
      participants: room.numParticipants || 0,
    }));

    res.json({ rooms: formattedRooms });
  } catch (error) {
    console.error('Error listing rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * ✅ Route to Delete a Room
 */
app.delete('/deleteRoom', async (req, res) => {
  try {
    const { roomName } = req.body;

    if (!roomName) {
      return res.status(400).json({ error: 'Missing roomName' });
    }

    await roomService.deleteRoom(roomName);
    res.json({ message: `Room '${roomName}' deleted successfully` });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// NEW

// Start composite MP4 recording
app.post('/record/start', async (req, res) => {
  const { roomName } = req.body;
  if (!roomName) return res.status(400).json({ error: 'Missing roomName' });

  try {
    // unique filename; container will write here under /out
    const filename = `${roomName}_${Date.now()}.mp4`;
    const fileOutput = new EncodedFileOutput({ filepath: `/out/${filename}` });

    // start recording in a grid-light layout
    const info = await egressClient.startRoomCompositeEgress(
      roomName,
      { file: fileOutput },
      { layout: 'grid-light' }
    );

    activeRecordings[roomName] = info.egressId;
    res.json({ message: 'Recording started', filename });
  } catch (err) {
    console.error('start error', err);
    res.status(500).json({ error: err.message });
  }
});

// Stop the active recording
app.post('/record/stop', async (req, res) => {
  const { roomName } = req.body;
  const egressId = activeRecordings[roomName];
  if (!egressId) return res.status(400).json({ error: 'No active recording' });

  try {
    await egressClient.stopEgress(egressId);
    delete activeRecordings[roomName];
    res.json({ message: 'Recording stopped' });
  } catch (err) {
    console.error('stop error', err);
    res.status(500).json({ error: err.message });
  }
});

//NEW


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});




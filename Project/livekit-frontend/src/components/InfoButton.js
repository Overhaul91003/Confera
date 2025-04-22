import React, { useState, useMemo } from 'react';
import {
  RoomName,
  useParticipants,
  useLocalParticipant,
  ParticipantContextIfNeeded,
  ParticipantName,
  ConnectionQualityIndicator,
  useIsMuted,
} from '@livekit/components-react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

export default function InfoButton() {
  const [open, setOpen] = useState(false);
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();

  // Sort local first, then alphabetically
  const sorted = useMemo(() => {
    const others = participants
      .filter(p => p.sid !== localParticipant.sid)
      .sort((a, b) => a.identity.localeCompare(b.identity));
    return [localParticipant, ...others];
  }, [participants, localParticipant]);

  // Subcomponent to render each participant
  const ParticipantItem = ({ participant }) => {
    // Get muted state for camera and microphone
    const isCamMuted = useIsMuted('camera', { participant });
    const isMicMuted = useIsMuted('microphone', { participant });

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 0',
          borderBottom: '1px solid #444',
        }}
      >
        <ParticipantName />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isCamMuted ? <VideoOff size={16} /> : <Video size={16} />}
          {isMicMuted ? <MicOff size={16} /> : <Mic size={16} />}
          <ConnectionQualityIndicator />
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#17A2B8',
          color: 'white',
          padding: '10px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
         Info
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: '120%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(34,34,34,0.9)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
            width: '320px',
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          <h3
            style={{
              margin: '0 0 8px',
              fontSize: '16px',
              borderBottom: '1px solid #555',
              paddingBottom: '4px',
            }}
          >
            Room Info
          </h3>

          <p style={{ margin: '4px 0' }}>
            <strong>Name:</strong> <RoomName />
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Total Participants:</strong> {sorted.length}
          </p>

          <strong style={{ display: 'block', margin: '8px 0 4px' }}>
            Who’s here:
          </strong>

          {sorted.map(p => (
            <ParticipantContextIfNeeded key={p.sid} participant={p}>
              <ParticipantItem participant={p} />
            </ParticipantContextIfNeeded>
          ))}
        </div>
      )}
    </div>
  );
}







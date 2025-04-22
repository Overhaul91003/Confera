import { useState, useEffect } from 'react';

const useLiveKitToken = (roomName, participantName, isPreJoinComplete) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isPreJoinComplete && participantName) {
      const fetchToken = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/getToken?roomName=${roomName}&participantName=${participantName}`
          );
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          if (data.token) setToken(data.token);
          else throw new Error('Token is empty');
        } catch (error) {
          setError(error.message);
        }
      };

      fetchToken();
    }
  }, [roomName, participantName, isPreJoinComplete]);

  return { token, error };
};

export default useLiveKitToken;

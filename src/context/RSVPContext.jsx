import React, { createContext, useState } from 'react';

export const RSVPContext = createContext();

export const RSVPProvider = ({ children }) => {
  const [joinedEvents, setJoinedEvents] = useState([]);

  const joinEvent = (event) => {
    setJoinedEvents((prevEvents) => {
      const exists = prevEvents.some((e) => e.id === event.id);
      if (!exists) return [...prevEvents, event];
      return prevEvents;
    });
  };

  const leaveEvent = (eventId) => {
    setJoinedEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
  };

  return (
    <RSVPContext.Provider value={{ joinedEvents, joinEvent, leaveEvent }}>
      {children}
    </RSVPContext.Provider>
  );
};



"use client";

import { Socket } from "phoenix";
import { useEffect, useState } from "react";

type Event = {
  collector: string;
  payload: object;
};

export default function Channel() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const socket = new Socket("ws://localhost:4000/ws");
    socket.connect();

    // subscribe to a single “all Pis” topic
    const chan = socket.channel("collector_events:all", {});
    chan
      .join()
      .receive("ok", () => console.log("joined"))
      .receive("error", ({ reason }) => console.error("join failed", reason));

    chan.on("new_event", (evt) => {
      setEvents((prev) => [...prev, evt as Event]);
    });

    setInterval(() => {
      chan.push("event", {
        collector_id: "test",
        payload: { message: "Hello, world!" },
      });
    }, 1000);

    return () => {
      chan.leave();
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Live Pi Events</h1>
      <ul>
        {events.map((e, i) => (
          <li key={i}>
            [{e.collector}] {JSON.stringify(e.payload)}
          </li>
        ))}
      </ul>
    </div>
  );
}

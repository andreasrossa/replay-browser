"use client";

import { env } from "@/env";
import { Socket } from "phoenix";
import { useEffect } from "react";

export function usePhoenixChannel(
  topic: string,
  onMessage?: (event: string, payload: unknown, ref: string) => void,
) {
  useEffect(() => {
    const socket = new Socket(env.NEXT_PUBLIC_WS_URL);
    socket.connect();

    const channel = socket.channel(topic);

    channel.onMessage = (event, payload, ref): unknown => {
      console.log("received message", event, payload, ref);
      onMessage?.(event, payload, ref as string);
      return payload;
    };

    channel.join();

    console.debug("joined channel", topic);

    return () => {
      console.debug("leaving channel", topic);
      channel.leave();
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);
}

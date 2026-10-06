import { useEffect, useState, useRef } from "react";
import type {
  DataMessage,
  GimickData,
  PlayerData,
  StageData,
} from "../types/websocket";

const useWebsocket = (roomId: string) => {
  const [stage, setStage] = useState<StageData | null>(null);
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [onOff, setOnOff] = useState<GimickData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // WebSocket の URL
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    let baseUrl = import.meta.env.VITE_WS_BASE_URL || "localhost:8080";
    if (isLocalhost) {
      baseUrl = "localhost:8080";
      console.log("Running on localhost, using local WebSocket server");
    }
    baseUrl = baseUrl.replace(/^(https?|wss?):\/\//, "").replace(/\/$/, "");
    const protocol = isLocalhost ? "ws" : (import.meta.env.VITE_WS_PROTOCOL || "ws");
    const socket = new WebSocket(`${protocol}://${baseUrl}/mobile/${roomId}`);
    socketRef.current = socket;

    // 接続成功
    socket.onopen = () => {
      console.log(`✅ Connected to room: ${roomId}`);
      setIsConnected(true);
    };

    // メッセージ受信
    socket.onmessage = (event) => {
      try {
        const messages = event.data
          .split("\n")
          .filter((msg: string) => msg.trim() !== "");

        messages.forEach((messageStr: string) => {
          try {
            const data: DataMessage = JSON.parse(messageStr);
            switch (data.type) {
              case "stage":
                if (data.from !== "server") {
                  return; // サーバーからのメッセージのみ処理
                }
                setStage(data.content as StageData);
                console.log("📬 Stage data updated:", data.content);
                break;
              case "player":
                if (data.from !== "server") {
                  return; // サーバーからのメッセージのみ処理
                }
                setPlayer(data.content as PlayerData);
                console.log("📬 Player data updated:", data.content);
                break;
              case "gimick":
                setOnOff(data.content as GimickData);
                console.log("📬 Gimick data updated:", data.content);
                break;
              default:
                console.warn("⚠️ Unknown message type:", data.type);
            }
          } catch (error) {
            console.error(
              "❌ Error parsing individual message:",
              error,
              "Message:",
              messageStr
            );
          }
        });
      } catch (error) {
        console.error(
          "❌ Error processing message:",
          error,
          "Message:",
          event.data
        );
      }
    };

    // エラー処理
    socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    // 切断処理
    socket.onclose = (event) => {
      console.warn(`⚠️ WebSocket closed: ${event.code}, ${event.reason}`);
      setIsConnected(false);
    };

    // クリーンアップ（コンポーネントがアンマウントされたとき）
    return () => {
      console.log(`🔌 Disconnecting from room: ${roomId}`);
      socket.close();
    };
  }, [roomId]); // roomId が変更されるたびに WebSocket 接続を再作成

  // メッセージ送信
  const sendMessage = (message: DataMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("❌ WebSocket is not open");
    }
  };

  return { stage, player, onOff, sendMessage, isConnected };
};

export default useWebsocket;

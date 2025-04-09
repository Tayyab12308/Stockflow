// polygonWebsocketService.ts
import { websocketClient } from "@polygon.io/client-js";
import { getApiKeys } from "../services/apiKeyService";

type Callback = (data: any) => void;

// Unique global symbol to store the singleton instance
const GLOBAL_KEY = Symbol.for("PolygonWebsocketServiceSingleton");

class PolygonWebsocketService {
  // Internal state is stored in this mutable object.
  private _state: {
    client: any;
    subscribers: Map<string, Callback[]>;
    isAuthenticated: boolean;
    pendingSubscriptions: Array<{ symbol: string; callback: Callback }>;
    initializationPromise: Promise<void> | null;
    reconnectAttempts: number;
  };

  constructor() {
    if ((globalThis as any)[GLOBAL_KEY]) {
      throw new Error("Instance already exists. Use PolygonWebsocketService.getInstance()");
    }

    this._state = {
      client: null,
      subscribers: new Map(),
      isAuthenticated: false,
      pendingSubscriptions: [],
      initializationPromise: null,
      reconnectAttempts: 0,
    };

    this._state.initializationPromise = this.initializeAsync();

    // Store the instance on the global object using the unique symbol
    (globalThis as any)[GLOBAL_KEY] = this;

    // Freeze the instance so that its properties (like _state) cannot be reassigned.
    // Note: _state’s internal values remain mutable.
    Object.freeze(this);
  }

  private async initializeAsync(): Promise<void> {

    const apiKeys = await getApiKeys();

    // Initialize mutable state object
    this._state.client = websocketClient(
      apiKeys.polygon_api_key,
      "wss://delayed.polygon.io"
    ).stocks();
   
    this._state.reconnectAttempts = 0;
    this._state.client.onerror = (err: any) => console.error("Failed to connect", err);
    this._state.client.onclose = (code: any, reason: any) =>

    this._state.client.onmessage = (msg: any) => {
      const parsedMessage = JSON.parse(msg.data);

      if (
        parsedMessage[0].ev === "status" &&
        parsedMessage[0].status === "auth_success"
      ) {
        this._state.isAuthenticated = true;

        // Process any pending subscriptions queued before authentication
        this._state.pendingSubscriptions.forEach(({ symbol, callback }) => {
          this.subscribe(symbol, callback);
        });
        this._state.pendingSubscriptions = [];
      }

      // Dispatch aggregate messages to subscribers
      if (parsedMessage[0].ev === "A") {
        const symbol = parsedMessage[0].sym;
        const callbacks = this._state.subscribers.get(symbol);
        if (callbacks && callbacks.length > 0) {
          callbacks.forEach((cb) => cb(parsedMessage[0]));
        }
      }
    };
  }

  // Subscribe to a symbol
  subscribe(symbol: string, callback: Callback) {
    if (!this._state.isAuthenticated) {
      this._state.pendingSubscriptions.push({ symbol, callback });
      return;
    }
    if (!this._state.subscribers.has(symbol)) {
      this._state.subscribers.set(symbol, []);
      this._state.client.send(
        JSON.stringify({
          action: "subscribe",
          params: `A.${symbol}`,
        })
      );
    }
    this._state.subscribers.get(symbol)?.push(callback);
  }

  // Unsubscribe from a symbol
  unsubscribe(symbol: string, callback: Callback) {
    if (this._state.subscribers.has(symbol)) {
      const updatedCallbacks = this._state.subscribers
        .get(symbol)!
        .filter((cb) => cb !== callback);
      if (updatedCallbacks.length === 0) {
        this._state.client.send(
          JSON.stringify({
            action: "unsubscribe",
            params: `A.${symbol}`,
          })
        );
        this._state.subscribers.delete(symbol);
      } else {
        this._state.subscribers.set(symbol, updatedCallbacks);
      }
    }
  }

  // Static method to get (or create) the singleton instance
  public static getInstance(): PolygonWebsocketService {
    if ((globalThis as any)[GLOBAL_KEY]) {
      return (globalThis as any)[GLOBAL_KEY];
    }
    return new PolygonWebsocketService();
  }
}

export { PolygonWebsocketService };

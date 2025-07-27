class AuctionWebSocketService {
  constructor() {
    this.ws = null;
    this.roomId = null;
    this.userId = null;
    this.username = null;
    this.eventListeners = {};
    this.reconnectInterval = 5000;
    this.maxReconnectAttempts = 5;
    this.reconnectAttempts = 0;
  }

  // Connect to auction room WebSocket
  connect(roomId, userId, username) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.roomId = roomId;
    this.userId = userId;
    this.username = username;

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
    const wsUrl = backendUrl.replace('http', 'ws');
    const websocketUrl = `${wsUrl}/api/auctions/ws/${roomId}?user_id=${userId}&username=${encodeURIComponent(username)}`;

    console.log('Connecting to WebSocket:', websocketUrl);

    try {
      this.ws = new WebSocket(websocketUrl);

      this.ws.onopen = (event) => {
        console.log('WebSocket connected to room:', roomId);
        this.reconnectAttempts = 0;
        this.emit('connected', { roomId, userId, username });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected from room:', roomId, 'Code:', event.code);
        this.emit('disconnected', { roomId, code: event.code });
        
        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            this.connect(roomId, userId, username);
          }, this.reconnectInterval);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.emit('error', error);
    }
  }

  // Handle incoming WebSocket messages
  handleMessage(message) {
    const { type } = message;

    switch (type) {
      case 'connection_confirmed':
        this.emit('connectionConfirmed', message);
        break;

      case 'user_joined':
        this.emit('userJoined', message);
        break;

      case 'user_left':
        this.emit('userLeft', message);
        break;

      case 'auction_started':
        this.emit('auctionStarted', message);
        break;

      case 'bid_placed':
        this.emit('bidPlaced', message);
        break;

      case 'bid_confirmed':
        this.emit('bidConfirmed', message);
        break;

      case 'bid_error':
        this.emit('bidError', message);
        break;

      case 'timer_update':
        this.emit('timerUpdate', message);
        break;

      case 'auction_ended':
        this.emit('auctionEnded', message);
        break;

      case 'room_state':
        this.emit('roomState', message);
        break;

      case 'error':
        this.emit('error', message);
        break;

      default:
        console.log('Unknown message type:', type, message);
        this.emit('unknownMessage', message);
    }
  }

  // Send a bid
  placeBid(amount) {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return false;
    }

    const message = {
      type: 'place_bid',
      amount: amount,
      timestamp: new Date().toISOString()
    };

    this.send(message);
    return true;
  }

  // Get current room status
  getStatus() {
    if (!this.isConnected()) {
      console.error('WebSocket not connected');
      return false;
    }

    const message = {
      type: 'get_status',
      timestamp: new Date().toISOString()
    };

    this.send(message);
    return true;
  }

  // Send ping to keep connection alive
  ping() {
    if (!this.isConnected()) {
      return false;
    }

    const message = {
      type: 'ping',
      timestamp: new Date().toISOString()
    };

    this.send(message);
    return true;
  }

  // Send raw message
  send(message) {
    if (!this.isConnected()) {
      console.error('Cannot send message: WebSocket not connected');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  // Check if WebSocket is connected
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    
    this.roomId = null;
    this.userId = null;
    this.username = null;
    this.reconnectAttempts = 0;
  }

  // Event listener management
  on(eventType, callback) {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = [];
    }
    this.eventListeners[eventType].push(callback);
  }

  off(eventType, callback) {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType] = this.eventListeners[eventType].filter(
        listener => listener !== callback
      );
    }
  }

  emit(eventType, data) {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  // Start ping interval to keep connection alive
  startPingInterval(intervalMs = 30000) {
    this.pingInterval = setInterval(() => {
      this.ping();
    }, intervalMs);
  }

  // Stop ping interval
  stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

// Export singleton instance
export const auctionWebSocket = new AuctionWebSocketService();
export default auctionWebSocket;
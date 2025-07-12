import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

class ApiService {
  // Players API
  static async getPlayers() {
    try {
      const response = await axios.get(`${API}/players`);
      return response.data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  }

  static async getPlayer(playerId) {
    try {
      const response = await axios.get(`${API}/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player:', error);
      throw error;
    }
  }

  static async placeBid(playerId, bidAmount, teamName) {
    try {
      const response = await axios.post(`${API}/players/${playerId}/bid`, null, {
        params: { bid_amount: bidAmount, team_name: teamName }
      });
      return response.data;
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  }

  // Teams API
  static async getTeams() {
    try {
      const response = await axios.get(`${API}/teams`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }

  static async getTeam(teamId) {
    try {
      const response = await axios.get(`${API}/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  }

  // Auctions API
  static async getAuctions() {
    try {
      const response = await axios.get(`${API}/auctions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching auctions:', error);
      throw error;
    }
  }

  static async getAuction(auctionId) {
    try {
      const response = await axios.get(`${API}/auctions/${auctionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching auction:', error);
      throw error;
    }
  }

  // Leagues API
  static async getLeagues() {
    try {
      const response = await axios.get(`${API}/leagues`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw error;
    }
  }

  static async getLeague(leagueId) {
    try {
      const response = await axios.get(`${API}/leagues/${leagueId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching league:', error);
      throw error;
    }
  }

  // Users API
  static async getUser(userId) {
    try {
      const response = await axios.get(`${API}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Utility functions
  static formatCurrency(amount) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)} K`;
    }
    return `₹${amount}`;
  }

  static getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export default ApiService;
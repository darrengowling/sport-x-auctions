#!/usr/bin/env python3
"""
Sports X Pro Cricket Auctions Backend API Test Suite
Tests all backend endpoints comprehensively
"""

import requests
import json
import sys
from datetime import datetime

# Get backend URL from frontend .env file
BACKEND_URL = "https://631e998d-8b3f-4f2c-bcfb-bc56e45f7943.preview.emergentagent.com/api"

class APITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and isinstance(response_data, dict):
            print(f"   Response keys: {list(response_data.keys())}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
    
    def test_health_endpoints(self):
        """Test basic health check endpoints"""
        print("=== Testing Health Check Endpoints ===")
        
        # Test root endpoint
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "Sports X" in data.get("message", ""):
                    self.log_test("GET /api/ - Root endpoint", True, 
                                f"Status: {response.status_code}, Message: {data.get('message')}", data)
                else:
                    self.log_test("GET /api/ - Root endpoint", False, 
                                f"Unexpected message: {data.get('message')}")
            else:
                self.log_test("GET /api/ - Root endpoint", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/ - Root endpoint", False, f"Exception: {str(e)}")
        
        # Test health endpoint
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("GET /api/health - Health check", True, 
                                f"Status: {data.get('status')}, Service: {data.get('service')}", data)
                else:
                    self.log_test("GET /api/health - Health check", False, 
                                f"Unexpected status: {data.get('status')}")
            else:
                self.log_test("GET /api/health - Health check", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/health - Health check", False, f"Exception: {str(e)}")
    
    def test_players_endpoints(self):
        """Test players API endpoints"""
        print("=== Testing Players API Endpoints ===")
        
        # Test get all players
        try:
            response = self.session.get(f"{self.base_url}/players")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check if we have the expected players
                    player_names = [p.get("name") for p in data]
                    expected_players = ["Virat Kohli", "MS Dhoni", "Jasprit Bumrah", "Rohit Sharma"]
                    found_players = [name for name in expected_players if name in player_names]
                    
                    # Check data structure of first player
                    first_player = data[0]
                    required_fields = ["id", "name", "role", "base_price", "current_bid", "image_url", "stats", "bidders"]
                    missing_fields = [field for field in required_fields if field not in first_player]
                    
                    if len(found_players) >= 3 and not missing_fields:
                        self.log_test("GET /api/players - Get all players", True, 
                                    f"Found {len(data)} players including {found_players}", 
                                    {"player_count": len(data), "sample_player": first_player})
                    else:
                        self.log_test("GET /api/players - Get all players", False, 
                                    f"Missing players: {set(expected_players) - set(found_players)}, Missing fields: {missing_fields}")
                else:
                    self.log_test("GET /api/players - Get all players", False, 
                                f"Expected list with players, got: {type(data)}")
            else:
                self.log_test("GET /api/players - Get all players", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/players - Get all players", False, f"Exception: {str(e)}")
        
        # Test get specific player (Virat Kohli)
        try:
            response = self.session.get(f"{self.base_url}/players/player-1")
            if response.status_code == 200:
                data = response.json()
                if data.get("name") == "Virat Kohli" and data.get("id") == "player-1":
                    # Check stats structure
                    stats = data.get("stats", {})
                    required_stats = ["matches", "runs", "average", "strike_rate"]
                    missing_stats = [stat for stat in required_stats if stat not in stats]
                    
                    if not missing_stats:
                        self.log_test("GET /api/players/player-1 - Get Virat Kohli", True, 
                                    f"Name: {data.get('name')}, Role: {data.get('role')}, Current Bid: {data.get('current_bid')}", data)
                    else:
                        self.log_test("GET /api/players/player-1 - Get Virat Kohli", False, 
                                    f"Missing stats: {missing_stats}")
                else:
                    self.log_test("GET /api/players/player-1 - Get Virat Kohli", False, 
                                f"Expected Virat Kohli, got: {data.get('name')}")
            else:
                self.log_test("GET /api/players/player-1 - Get Virat Kohli", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/players/player-1 - Get Virat Kohli", False, f"Exception: {str(e)}")
        
        # Test placing a bid
        try:
            # First get current bid
            response = self.session.get(f"{self.base_url}/players/player-1")
            if response.status_code == 200:
                current_player = response.json()
                current_bid = current_player.get("current_bid", 0)
                new_bid = current_bid + 1000000  # Add 1M to current bid
                
                # Place bid (Note: FastAPI expects query parameters for this endpoint based on the code)
                bid_response = self.session.post(f"{self.base_url}/players/player-1/bid?bid_amount={new_bid}&team_name=Test Team")
                
                if bid_response.status_code == 200:
                    bid_data = bid_response.json()
                    if bid_data.get("current_bid") == new_bid and "Test Team" in bid_data.get("bidders", []):
                        self.log_test("POST /api/players/player-1/bid - Place bid", True, 
                                    f"New bid: {new_bid}, Bidders: {bid_data.get('bidders')}", bid_data)
                    else:
                        self.log_test("POST /api/players/player-1/bid - Place bid", False, 
                                    f"Bid not updated correctly. Expected: {new_bid}, Got: {bid_data.get('current_bid')}")
                else:
                    self.log_test("POST /api/players/player-1/bid - Place bid", False, 
                                f"Status: {bid_response.status_code}, Response: {bid_response.text}")
            else:
                self.log_test("POST /api/players/player-1/bid - Place bid", False, 
                            "Could not get current player data for bidding")
        except Exception as e:
            self.log_test("POST /api/players/player-1/bid - Place bid", False, f"Exception: {str(e)}")
    
    def test_teams_endpoints(self):
        """Test teams API endpoints"""
        print("=== Testing Teams API Endpoints ===")
        
        # Test get all teams
        try:
            response = self.session.get(f"{self.base_url}/teams")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check for Team Alpha
                    team_names = [t.get("name") for t in data]
                    if "Team Alpha" in team_names:
                        first_team = data[0]
                        required_fields = ["id", "name", "budget", "spent", "remaining", "players"]
                        missing_fields = [field for field in required_fields if field not in first_team]
                        
                        if not missing_fields:
                            self.log_test("GET /api/teams - Get all teams", True, 
                                        f"Found {len(data)} teams including Team Alpha", 
                                        {"team_count": len(data), "sample_team": first_team})
                        else:
                            self.log_test("GET /api/teams - Get all teams", False, 
                                        f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("GET /api/teams - Get all teams", False, 
                                    f"Team Alpha not found. Available teams: {team_names}")
                else:
                    self.log_test("GET /api/teams - Get all teams", False, 
                                f"Expected list with teams, got: {type(data)}")
            else:
                self.log_test("GET /api/teams - Get all teams", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/teams - Get all teams", False, f"Exception: {str(e)}")
        
        # Test get specific team (Team Alpha)
        try:
            response = self.session.get(f"{self.base_url}/teams/team-1")
            if response.status_code == 200:
                data = response.json()
                if data.get("name") == "Team Alpha" and data.get("id") == "team-1":
                    budget_info = f"Budget: {data.get('budget')}, Spent: {data.get('spent')}, Remaining: {data.get('remaining')}"
                    players_count = len(data.get("players", []))
                    self.log_test("GET /api/teams/team-1 - Get Team Alpha", True, 
                                f"{budget_info}, Players: {players_count}", data)
                else:
                    self.log_test("GET /api/teams/team-1 - Get Team Alpha", False, 
                                f"Expected Team Alpha, got: {data.get('name')}")
            else:
                self.log_test("GET /api/teams/team-1 - Get Team Alpha", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/teams/team-1 - Get Team Alpha", False, f"Exception: {str(e)}")
    
    def test_auctions_endpoints(self):
        """Test auctions API endpoints"""
        print("=== Testing Auctions API Endpoints ===")
        
        # Test get all auctions
        try:
            response = self.session.get(f"{self.base_url}/auctions")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check for IPL 2025 Mega Auction
                    auction_names = [a.get("name") for a in data]
                    if "IPL 2025 Mega Auction" in auction_names:
                        first_auction = data[0]
                        required_fields = ["id", "name", "status", "participants", "total_budget"]
                        missing_fields = [field for field in required_fields if field not in first_auction]
                        
                        if not missing_fields:
                            self.log_test("GET /api/auctions - Get all auctions", True, 
                                        f"Found {len(data)} auctions including IPL 2025 Mega Auction", 
                                        {"auction_count": len(data), "sample_auction": first_auction})
                        else:
                            self.log_test("GET /api/auctions - Get all auctions", False, 
                                        f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("GET /api/auctions - Get all auctions", False, 
                                    f"IPL 2025 Mega Auction not found. Available auctions: {auction_names}")
                else:
                    self.log_test("GET /api/auctions - Get all auctions", False, 
                                f"Expected list with auctions, got: {type(data)}")
            else:
                self.log_test("GET /api/auctions - Get all auctions", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/auctions - Get all auctions", False, f"Exception: {str(e)}")
        
        # Test get specific auction
        try:
            response = self.session.get(f"{self.base_url}/auctions/auction-1")
            if response.status_code == 200:
                data = response.json()
                if data.get("name") == "IPL 2025 Mega Auction" and data.get("id") == "auction-1":
                    status_info = f"Status: {data.get('status')}, Participants: {len(data.get('participants', []))}"
                    self.log_test("GET /api/auctions/auction-1 - Get IPL 2025 Mega Auction", True, 
                                status_info, data)
                else:
                    self.log_test("GET /api/auctions/auction-1 - Get IPL 2025 Mega Auction", False, 
                                f"Expected IPL 2025 Mega Auction, got: {data.get('name')}")
            else:
                self.log_test("GET /api/auctions/auction-1 - Get IPL 2025 Mega Auction", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/auctions/auction-1 - Get IPL 2025 Mega Auction", False, f"Exception: {str(e)}")
    
    def test_leagues_endpoints(self):
        """Test leagues API endpoints"""
        print("=== Testing Leagues API Endpoints ===")
        
        # Test get all leagues
        try:
            response = self.session.get(f"{self.base_url}/leagues")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check for Friends Championship
                    league_names = [l.get("name") for l in data]
                    if "Friends Championship" in league_names:
                        first_league = data[0]
                        required_fields = ["id", "name", "type", "status", "creator_name", "participants"]
                        missing_fields = [field for field in required_fields if field not in first_league]
                        
                        if not missing_fields:
                            self.log_test("GET /api/leagues - Get all leagues", True, 
                                        f"Found {len(data)} leagues including Friends Championship", 
                                        {"league_count": len(data), "sample_league": first_league})
                        else:
                            self.log_test("GET /api/leagues - Get all leagues", False, 
                                        f"Missing fields: {missing_fields}")
                    else:
                        self.log_test("GET /api/leagues - Get all leagues", False, 
                                    f"Friends Championship not found. Available leagues: {league_names}")
                else:
                    self.log_test("GET /api/leagues - Get all leagues", False, 
                                f"Expected list with leagues, got: {type(data)}")
            else:
                self.log_test("GET /api/leagues - Get all leagues", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/leagues - Get all leagues", False, f"Exception: {str(e)}")
        
        # Test get specific league
        try:
            response = self.session.get(f"{self.base_url}/leagues/league-1")
            if response.status_code == 200:
                data = response.json()
                if data.get("name") == "Friends Championship" and data.get("id") == "league-1":
                    league_info = f"Type: {data.get('type')}, Status: {data.get('status')}, Prize: {data.get('prize_pool')}"
                    self.log_test("GET /api/leagues/league-1 - Get Friends Championship", True, 
                                league_info, data)
                else:
                    self.log_test("GET /api/leagues/league-1 - Get Friends Championship", False, 
                                f"Expected Friends Championship, got: {data.get('name')}")
            else:
                self.log_test("GET /api/leagues/league-1 - Get Friends Championship", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/leagues/league-1 - Get Friends Championship", False, f"Exception: {str(e)}")
    
    def test_users_endpoints(self):
        """Test users API endpoints"""
        print("=== Testing Users API Endpoints ===")
        
        # Test get specific user
        try:
            response = self.session.get(f"{self.base_url}/users/user-1")
            if response.status_code == 200:
                data = response.json()
                if data.get("name") == "Cricket Fan" and data.get("id") == "user-1":
                    user_info = f"Username: {data.get('username')}, Level: {data.get('level')}, Win Rate: {data.get('win_rate')}%"
                    self.log_test("GET /api/users/user-1 - Get Cricket Fan", True, 
                                user_info, data)
                else:
                    self.log_test("GET /api/users/user-1 - Get Cricket Fan", False, 
                                f"Expected Cricket Fan, got: {data.get('name')}")
            else:
                self.log_test("GET /api/users/user-1 - Get Cricket Fan", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/users/user-1 - Get Cricket Fan", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling for invalid IDs"""
        print("=== Testing Error Handling ===")
        
        # Test invalid player ID
        try:
            response = self.session.get(f"{self.base_url}/players/invalid-player")
            if response.status_code == 404:
                self.log_test("GET /api/players/invalid-player - Error handling", True, 
                            "Correctly returns 404 for invalid player ID")
            else:
                self.log_test("GET /api/players/invalid-player - Error handling", False, 
                            f"Expected 404, got: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/players/invalid-player - Error handling", False, f"Exception: {str(e)}")
        
        # Test invalid team ID
        try:
            response = self.session.get(f"{self.base_url}/teams/invalid-team")
            if response.status_code == 404:
                self.log_test("GET /api/teams/invalid-team - Error handling", True, 
                            "Correctly returns 404 for invalid team ID")
            else:
                self.log_test("GET /api/teams/invalid-team - Error handling", False, 
                            f"Expected 404, got: {response.status_code}")
        except Exception as e:
            self.log_test("GET /api/teams/invalid-team - Error handling", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all test suites"""
        print(f"🏏 Sports X Pro Cricket Auctions API Test Suite")
        print(f"Testing backend at: {self.base_url}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        self.test_health_endpoints()
        self.test_players_endpoints()
        self.test_teams_endpoints()
        self.test_auctions_endpoints()
        self.test_leagues_endpoints()
        self.test_users_endpoints()
        self.test_error_handling()
        
        # Summary
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print("=" * 60)
        print(f"🏏 TEST SUMMARY")
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   - {result['test']}: {result['details']}")
        
        return passed_tests, failed_tests

if __name__ == "__main__":
    tester = APITester(BACKEND_URL)
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if tests failed
    sys.exit(0 if failed == 0 else 1)
import React, { useState } from 'react';

// Sample data - replace with your actual data
const leaderboardData = [
  {
    id: 1,
    name: "Sarah Johnson",
    contributions: 32,
    campaigns: 15,
    badges: [
      { id: 1, code: "R", color: "#27ae60" },
      { id: 2, code: "W", color: "#e74c3c" },
      { id: 3, code: "E", color: "#f39c12" }
    ],
    badgeType: "gold"
  },
  {
    id: 2,
    name: "Michael Chen",
    contributions: 28,
    campaigns: 12,
    badges: [
      { id: 1, code: "R", color: "#27ae60" },
      { id: 2, code: "C", color: "#3498db" }
    ],
    badgeType: "silver"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    contributions: 25,
    campaigns: 10,
    badges: [
      { id: 1, code: "R", color: "#27ae60" },
      { id: 2, code: "W", color: "#e74c3c" }
    ],
    badgeType: "bronze"
  },
  {
    id: 4,
    name: "James Wilson",
    contributions: 22,
    campaigns: 8,
    badges: [
      { id: 1, code: "C", color: "#3498db" }
    ],
    badgeType: "standard"
  }
];

// CSS styles as object
const styles = {
  badgeGold: {
    background: 'linear-gradient(135deg, #f9d423 0%, #e65c00 100%)'
  },
  badgeSilver: {
    background: 'linear-gradient(135deg, #bdc3c7 0%, #8e9eab 100%)'
  },
  badgeBronze: {
    background: 'linear-gradient(135deg, #e79e4f 0%, #a87732 100%)'
  },
  badgeStandard: {
    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
  }
};

// Chart component that displays the leaderboard
const Chart = () => {
  const [activeTab, setActiveTab] = useState('recent');

  // Function to get badge style based on type
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'gold': return styles.badgeGold;
      case 'silver': return styles.badgeSilver;
      case 'bronze': return styles.badgeBronze;
      default: return styles.badgeStandard;
    }
  };

  // Function to get badge letter based on type
  const getBadgeLetter = (type) => {
    switch (type) {
      case 'gold': return 'G';
      case 'silver': return 'S';
      case 'bronze': return 'B';
      default: return 'S';
    }
  };

  return (
    <div className="p-4">
      <p className="text-gray-600 mb-6">
        Members with the most participation in EcoWise campaigns
      </p>

      <div className="tabs flex justify-center mb-6">
        <button 
          className={`tab px-5 py-2 mx-1 rounded-full font-semibold cursor-pointer border-none ${activeTab === 'recent' ? 'bg-gray-800 text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
        <button 
          className={`tab px-5 py-2 mx-1 rounded-full font-semibold cursor-pointer border-none ${activeTab === 'allTime' ? 'bg-gray-800 text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('allTime')}
        >
          All Time
        </button>
      </div>
      
      <div className="leaderboard-list flex flex-col gap-4">
        {leaderboardData.map((user, index) => (
          <div className="leaderboard-item flex items-center bg-white rounded-lg p-4 shadow-md transition duration-200 hover:-translate-y-1 relative" key={user.id}>
            <div className="rank text-xl font-bold w-10 text-center">{index + 1}</div>
            <div className="user-info flex items-center flex-1">
              <div 
                className="badge w-14 h-14 rounded-full flex items-center justify-center mr-4 text-white font-bold text-lg"
                style={getBadgeStyle(user.badgeType)}
              >
                {getBadgeLetter(user.badgeType)}
              </div>
              <div className="user-details flex flex-col">
                <div className="user-name text-lg font-semibold">{user.name}</div>
                <div className="view-count text-gray-500 text-sm">{user.contributions} contributions</div>
              </div>
            </div>
            <div className="campaigns bg-gray-100 rounded-full px-4 py-1 font-semibold text-gray-800 flex items-center gap-1">
              <span>Campaigns:</span>
              <span className="campaign-count text-green-600">{user.campaigns}</span>
            </div>
            <div className="badges-container flex flex-wrap gap-2 ml-auto justify-end">
              {user.badges.map(badge => (
                <div 
                  key={badge.id}
                  className="badge-small w-10 h-10 rounded-md flex items-center justify-center text-sm font-semibold" 
                  style={{ backgroundColor: badge.color, color: 'white' }}
                >
                  {badge.code}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="see-more text-center py-4 bg-gray-100 rounded-lg mt-4 font-semibold text-gray-800 cursor-pointer">
          See More
        </div>
      </div>
    </div>
  );
};

// Admin team component (placeholder)
const AdminTeam = () => {
  return (
    <div className="p-4">
      {/* Your admin team content here */}
      <p>Admin team information will be displayed here.</p>
    </div>
  );
};

// Main application component
const LeaderboardApp = () => {
  return (
    <div className="flex flex-col md:flex-row lg:px-32 md:px-32">
      <div className="w-full md:w-3/6">
        <div className="bg-white w-11/12 md:w-full rounded-lg mx-auto my-4 text-center border-2 border-black">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl py-6">
            Leader Board
          </h1>
          <Chart />
        </div>
      </div>
      
    </div>
  );
};

export default LeaderboardApp;
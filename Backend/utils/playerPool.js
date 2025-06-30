// Cricket players pool with detailed information
export const cricketPlayersData = [
  // Batsmen
  { id: 1, name: "Virat Kohli", role: "Batsman", rating: 95, country: "India", specialty: "Chase Master" },
  { id: 2, name: "Rohit Sharma", role: "Batsman", rating: 92, country: "India", specialty: "Opener" },
  { id: 3, name: "Kane Williamson", role: "Batsman", rating: 93, country: "New Zealand", specialty: "Anchor" },
  { id: 4, name: "Steve Smith", role: "Batsman", rating: 94, country: "Australia", specialty: "Technique" },
  { id: 5, name: "Joe Root", role: "Batsman", rating: 90, country: "England", specialty: "Consistency" },
  { id: 6, name: "Babar Azam", role: "Batsman", rating: 91, country: "Pakistan", specialty: "Elegance" },
  { id: 7, name: "David Warner", role: "Batsman", rating: 88, country: "Australia", specialty: "Aggression" },
  { id: 8, name: "KL Rahul", role: "Wicket-keeper", rating: 87, country: "India", specialty: "Versatility" },
  
  // Wicket-keepers
  { id: 9, name: "MS Dhoni", role: "Wicket-keeper", rating: 89, country: "India", specialty: "Finisher" },
  { id: 10, name: "Rishabh Pant", role: "Wicket-keeper", rating: 85, country: "India", specialty: "Explosive" },
  { id: 11, name: "Jos Buttler", role: "Wicket-keeper", rating: 86, country: "England", specialty: "Power Play" },
  { id: 12, name: "Quinton de Kock", role: "Wicket-keeper", rating: 84, country: "South Africa", specialty: "Opener" },
  
  // Fast Bowlers
  { id: 13, name: "Jasprit Bumrah", role: "Fast Bowler", rating: 96, country: "India", specialty: "Death Bowling" },
  { id: 14, name: "Pat Cummins", role: "Fast Bowler", rating: 94, country: "Australia", specialty: "Pace & Bounce" },
  { id: 15, name: "Kagiso Rabada", role: "Fast Bowler", rating: 92, country: "South Africa", specialty: "Express Pace" },
  { id: 16, name: "Trent Boult", role: "Fast Bowler", rating: 90, country: "New Zealand", specialty: "Swing" },
  { id: 17, name: "Mohammed Shami", role: "Fast Bowler", rating: 88, country: "India", specialty: "Reverse Swing" },
  { id: 18, name: "Mitchell Starc", role: "Fast Bowler", rating: 89, country: "Australia", specialty: "Left Arm Pace" },
  
  // Spin Bowlers
  { id: 19, name: "Rashid Khan", role: "Spin Bowler", rating: 91, country: "Afghanistan", specialty: "Leg Spin" },
  { id: 20, name: "Ravindra Jadeja", role: "All-rounder", rating: 87, country: "India", specialty: "Spin + Fielding" },
  { id: 21, name: "Yuzvendra Chahal", role: "Spin Bowler", rating: 83, country: "India", specialty: "Leg Spin" },
  { id: 22, name: "Adam Zampa", role: "Spin Bowler", rating: 82, country: "Australia", specialty: "Leg Spin" },
  
  // All-rounders
  { id: 23, name: "Ben Stokes", role: "All-rounder", rating: 93, country: "England", specialty: "Match Winner" },
  { id: 24, name: "Hardik Pandya", role: "All-rounder", rating: 85, country: "India", specialty: "Power & Pace" },
  { id: 25, name: "Shakib Al Hasan", role: "All-rounder", rating: 86, country: "Bangladesh", specialty: "Spin + Batting" },
  { id: 26, name: "Glenn Maxwell", role: "All-rounder", rating: 84, country: "Australia", specialty: "Big Hitting" },
  { id: 27, name: "Jason Holder", role: "All-rounder", rating: 83, country: "West Indies", specialty: "Pace + Leadership" },
  { id: 28, name: "Chris Woakes", role: "All-rounder", rating: 81, country: "England", specialty: "Swing Bowling" },
  
  // Additional Players
  { id: 29, name: "Suryakumar Yadav", role: "Batsman", rating: 82, country: "India", specialty: "360° Shots" },
  { id: 30, name: "Faf du Plessis", role: "Batsman", rating: 86, country: "South Africa", specialty: "Experience" }
];

// Function to get a shuffled copy of players for each game
export const cricketPlayers = () => {
  return [...cricketPlayersData].sort(() => 0.5 - Math.random());
};

// Get players by role
export const getPlayersByRole = (role) => {
  return cricketPlayersData.filter(player => player.role === role);
};

// Get top players by rating
export const getTopPlayers = (count = 10) => {
  return [...cricketPlayersData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
};
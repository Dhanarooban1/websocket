// Sample cricket players data for the frontend demo
export const samplePlayers = [
  // Batsmen
  { id: 1, name: "Virat Kohli", role: "Batsman", rating: 95, country: "India" },
  { id: 2, name: "Kane Williamson", role: "Batsman", rating: 92, country: "New Zealand" },
  { id: 3, name: "Steve Smith", role: "Batsman", rating: 93, country: "Australia" },
  { id: 4, name: "Joe Root", role: "Batsman", rating: 90, country: "England" },
  { id: 5, name: "Babar Azam", role: "Batsman", rating: 91, country: "Pakistan" },
  { id: 6, name: "David Warner", role: "Batsman", rating: 88, country: "Australia" },
  { id: 7, name: "Rohit Sharma", role: "Batsman", rating: 89, country: "India" },
  { id: 8, name: "Quinton de Kock", role: "Wicket-keeper", rating: 86, country: "South Africa" },
  
  // Bowlers
  { id: 9, name: "Jasprit Bumrah", role: "Fast Bowler", rating: 94, country: "India" },
  { id: 10, name: "Pat Cummins", role: "Fast Bowler", rating: 93, country: "Australia" },
  { id: 11, name: "Trent Boult", role: "Fast Bowler", rating: 90, country: "New Zealand" },
  { id: 12, name: "Kagiso Rabada", role: "Fast Bowler", rating: 91, country: "South Africa" },
  { id: 13, name: "Rashid Khan", role: "Spin Bowler", rating: 89, country: "Afghanistan" },
  { id: 14, name: "Nathan Lyon", role: "Spin Bowler", rating: 85, country: "Australia" },
  { id: 15, name: "Ravindra Jadeja", role: "All-rounder", rating: 87, country: "India" },
  
  // All-rounders
  { id: 16, name: "Ben Stokes", role: "All-rounder", rating: 92, country: "England" },
  { id: 17, name: "Shakib Al Hasan", role: "All-rounder", rating: 88, country: "Bangladesh" },
  { id: 18, name: "Jason Holder", role: "All-rounder", rating: 85, country: "West Indies" },
  { id: 19, name: "Glenn Maxwell", role: "All-rounder", rating: 84, country: "Australia" },
  { id: 20, name: "Hardik Pandya", role: "All-rounder", rating: 83, country: "India" },
  
  // More players
  { id: 21, name: "MS Dhoni", role: "Wicket-keeper", rating: 87, country: "India" },
  { id: 22, name: "Jos Buttler", role: "Wicket-keeper", rating: 86, country: "England" },
  { id: 23, name: "KL Rahul", role: "Wicket-keeper", rating: 85, country: "India" },
  { id: 24, name: "Mohammad Amir", role: "Fast Bowler", rating: 82, country: "Pakistan" },
  { id: 25, name: "Yuzvendra Chahal", role: "Spin Bowler", rating: 81, country: "India" },
  { id: 26, name: "Mitchell Starc", role: "Fast Bowler", rating: 89, country: "Australia" },
  { id: 27, name: "Jonny Bairstow", role: "Wicket-keeper", rating: 84, country: "England" },
  { id: 28, name: "Faf du Plessis", role: "Batsman", rating: 87, country: "South Africa" },
  { id: 29, name: "Martin Guptill", role: "Batsman", rating: 83, country: "New Zealand" },
  { id: 30, name: "Chris Gayle", role: "Batsman", rating: 85, country: "West Indies" }
];

export const getRandomPlayers = (count = 25) => {
  const shuffled = [...samplePlayers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const { models: { UserMovie, Movie, Friend } }  = require('../server/db') // Adjust the path if needed
const _ = require('lodash');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');




async function fetchData() {
  try {
    // Fetch user-movie ratings
    const userMovies = await UserMovie.findAll({
      where: { rating: { [Op.not]: null } }, // Only include rows with ratings
      raw: true,
    });

    console.log('UserMovie:', userMovies);
    // Fetch movie metadata
    const movies = await Movie.findAll({
      attributes: ['id', 'title', 'genres', 'criticScore', 'runtimeMinutes'],
      raw: true,
    });

    console.log('Movie:', movies);

    // Fetch friend relationships
    const friends = await Friend.findAll({
      where: { status: 'accepted' },
      raw: true,
    });

    console.log('Friend:', friends);

    // Create a map for movies for quick lookup
    const movieMap = _.keyBy(movies, 'id');

    // Create a map for friends
    const friendMap = _.groupBy(friends, 'userId');

    // Add movie details and compute AvgFriendRating
    const enrichedData = userMovies.map((entry) => {
      const movie = movieMap[entry.movieId];
      const userFriends = friendMap[entry.userId] || [];

      // Get the IDs of the user's friends
      const friendIds = userFriends.map((friend) => friend.friendId);

      // Get the ratings from the user's friends for this movie
      const friendRatings = userMovies
        .filter((um) => friendIds.includes(um.userId) && um.movieId === entry.movieId)
        .map((um) => um.rating);

      const avgFriendRating = friendRatings.length
        ? _.mean(friendRatings)
        : null;

      return {
        ...entry,
        title: movie?.title || 'Unknown',
        genres: movie?.genres || [],
        criticScore: movie?.criticScore || null,
        runtimeMinutes: movie?.runtimeMinutes || null,
        avgFriendRating,
      };
    });

    // Save to CSV
    const outputPath = path.join(__dirname, 'training_data.csv');
    const csvData = [
      'userId,movieId,rating,watched,dateWatched,title,genres,criticScore,runtimeMinutes,avgFriendRating',
      ...enrichedData.map((row) =>
        [
          row.userId,
          row.movieId,
          row.rating,
          row.watched,
          row.dateWatched,
          row.title,
          row.genres.join('|'), // Join genres into a string
          row.criticScore,
          row.runtimeMinutes,
          row.avgFriendRating,
        ].join(',')
      ),
    ].join('\n');
    fs.writeFileSync(outputPath, csvData);
    console.log(`Data saved to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Run the script
fetchData();

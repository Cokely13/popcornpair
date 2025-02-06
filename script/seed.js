'use strict';
require('dotenv').config();
const axios = require('axios');
const { db, models: { User, Movie } } = require('../server/db'); // Assuming Movie is in your models
const WATCHMODE_API_KEY = process.env.WATCHMODE_API_KEY;

/**
 * seed - this function clears the database, updates tables to
 * match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'Ryan', password: '123', email: "ryan.cokely@gmail.com", isAdmin: true }),
    User.create({ username: 'Scott', password: '123', email: "scottlcokely@gmail.com", isAdmin: true }),
    User.create({ username: 'Matt', password: '123', email: "mclaise@gmail.com" }),
    User.create({ username: 'Beth', password: '123', email: "bethcokely@gmail.com" }),
    User.create({ username: 'Jamal', password: '123', email: "Costonj514@gmail.com" }),
    User.create({ username: 'Tebo', password: '123', email: "Jacob.Thibeault@gmail.com"}),
  ]);

  console.log(`seeded ${users.length} users`);

  // Fetching popular movies from Watchmode
  try {
    const response = await axios.get('https://api.watchmode.com/v1/list-titles/', {
      params: {
        apiKey: WATCHMODE_API_KEY,
        types: 'movie', // Filter for movies
        sort_by: 'popularity_desc', // Sort by popularity descending
        limit: 100, // Limit to 50 movies
      },
    });

    const movies = response.data.titles; // Assuming the API returns movies under "titles"
    console.log(`Fetched ${movies.length} movies`);

    // Saving movies to the database
    for (const movie of movies) {
      // Fetch detailed data for each movie
      const detailsResponse = await axios.get(`https://api.watchmode.com/v1/title/${movie.id}/details/`, {
        params: { apiKey: WATCHMODE_API_KEY },
      });

      const details = detailsResponse.data;


      await Movie.create({
        title: details.title || 'Untitled',
        description: details.plot_overview || 'No description available',
        releaseDate: details.release_date || null,
        posterUrl: details.poster || null,
        genres: details.genre_names || [],
        watchProviders: details.sources || [],
        tmdbId: details.tmdb_id || null,
        userRating: details.user_rating || null,
        criticScore: details.critic_score || null,
        runtimeMinutes: details.runtime_minutes || null,
        streaming: details.networks || null,
      });
    }

    console.log(`seeded ${movies.length} movies successfully`);
  } catch (error) {
    console.error('Error fetching movies from Watchmode:', error);
  }

  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
  };
}

/**
 * runSeed - isolates error handling and executes the seed function
 */
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;


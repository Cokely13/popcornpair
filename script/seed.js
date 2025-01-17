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
    User.create({ username: 'cody', password: '123' }),
    User.create({ username: 'murphy', password: '123' }),
  ]);

  console.log(`seeded ${users.length} users`);

  // Fetching popular movies from Watchmode
  try {
    const response = await axios.get('https://api.watchmode.com/v1/list-titles/', {
      params: {
        apiKey: WATCHMODE_API_KEY,
        types: 'movie', // Filter for movies
        sort_by: 'popularity_desc', // Sort by popularity descending
        limit: 50, // Limit to 50 movies
      },
    });

    const movies = response.data.titles; // Assuming the API returns movies under "titles"
    console.log(`Fetched ${movies.length} movies`);

    // Saving movies to the database
    for (const movie of movies) {
      await Movie.create({
        title: movie.title,
        description: movie.plot_overview || 'No description available',
        releaseDate: movie.release_date || null,
        posterUrl: movie.poster || null,
        genres: movie.genre_names || [],
        watchProviders: movie.sources || {}, // Assuming "sources" has streaming data
        tmdbId: movie.tmdb_id || null, // Assuming Watchmode provides TMDB IDs
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

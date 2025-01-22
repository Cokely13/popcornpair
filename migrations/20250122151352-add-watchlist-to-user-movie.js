// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//   }
// };

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add a new column 'watchlist' to the 'user_movies' table
    await queryInterface.addColumn('user_movies', 'watchlist', {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Default to false
      allowNull: false, // Ensure the field is not nullable
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'watchlist' column from the 'user_movies' table
    await queryInterface.removeColumn('user_movies', 'watchlist');
  }
};

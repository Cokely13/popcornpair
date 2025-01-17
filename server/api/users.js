const router = require('express').Router();
const {
  models: { User, Movie, Rating },
} = require('../db');
// const { S3Client } = require('@aws-sdk/client-s3'); // AWS SDK v3
// const multer = require('multer');
// const multerS3 = require('multer-s3');

module.exports = router;

// // Initialize S3 client
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
//   console.error('Missing AWS environment variables. Ensure they are set in Heroku.');
// }

// // Set up multer for file uploads with S3
// const upload = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: process.env.S3_BUCKET_NAME,
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString() + '-' + file.originalname);
//     },
//   }),
// });

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username'],
      include: [Movie, Rating],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Update user by ID with image upload to S3
router.put('/:id', upload.single('image'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    // If an image is uploaded, update the image field with the S3 URL
    if (req.file) {
      req.body.image = req.file.location; // URL of the uploaded image on S3
    }

    const updatedUser = await user.update(req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Create a new user
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.location; // URL of the uploaded image on S3
    }
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: [Movie, Rating]
      }],
      attributes: ['id', 'username'],
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.send(user);
  } catch (error) {
    next(error);
  }
});

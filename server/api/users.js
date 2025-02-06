// const router = require('express').Router();
// require('dotenv').config();
// const {
//   models: { User, Movie,UserMovie, UserRecommendation },
// } = require('../db');

// module.exports = router;
// const { S3Client } = require('@aws-sdk/client-s3'); // AWS SDK v3
// const multer = require('multer');
// const multerS3 = require('multer-s3');


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

// router.get('/', async (req, res, next) => {
//   try {
//     const users = await User.findAll({
//       attributes: ['id', 'username', 'email', 'isAdmin', 'image'],
//       include: [Movie,]
//     });
//     res.json(users);
//   } catch (err) {
//     next(err);
//   }
// });

// router.put('/:id', upload.single('image'), async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.id);

//     // If an image is uploaded, update the image field with the S3 URL
//     if (req.file) {
//       req.body.image = req.file.location; // URL of the uploaded image on S3
//     }

//     const updatedUser = await user.update(req.body);
//     res.json(updatedUser);
//   } catch (error) {
//     next(error);
//   }
// });


// // router.put('/:id', async (req, res, next) => {
// //   try {
// //     const user = await User.findByPk(req.params.id);
// //     const updatedUser = await user.update(req.body);
// //     res.json(updatedUser);
// //   } catch (error) {
// //     next(error);
// //   }
// // });

// router.post('/', async (req, res, next) => {
//   try {
//     const newUser = await User.create(req.body);
//     res.status(201).json(newUser);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get('/:id', async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.id, {
//       include: [Movie],
//       attributes: ['id', 'username', 'email', 'image', ],
//     });
//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// });

// router.delete('/:id', async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     await user.destroy();
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// });

// // ===== Password Reset Route =====

// // This route handles password reset requests.
// // It expects { email } in the request body.
// // It searches for a user with that email, generates a token, stores it on the user,
// // and sends an email with a reset link (e.g., http://<your-domain>/reset-password?token=XYZ).

// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// router.post('/reset-password', async (req, res, next) => {
//   const { email } = req.body;
//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }
//   try {
//     // Find the user with the matching email
//     const user = await User.findOne({ where: { email } });
//     if (user) {
//       // Generate a secure token
//       const token = crypto.randomBytes(20).toString('hex');
//       const expiry = Date.now() + 3600000; // Token expires in 1 hour
//       // Update user with the token and its expiry (ensure these fields exist on your User model)
//       await user.update({ resetToken: token, resetTokenExpiry: expiry });

//       // Set up nodemailer transport (example uses Gmail; adjust as needed)
//       let transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: process.env.GMAIL_USER, // e.g., your Gmail address
//           pass: process.env.GMAIL_PASS, // your Gmail password or app password
//         },
//       });

//       // Define the email options
//       let mailOptions = {
//         from: process.env.GMAIL_USER,
//         to: user.email,
//         subject: 'Password Reset Request',
//         text: `You have requested to reset your password.\n\n
// Please click on the following link, or paste it into your browser to complete the process:\n\n
// http://${req.headers.host}/reset-password?token=${token}\n\n
// If you did not request this, please ignore this email.`,
//       };

//       // Send the email
//       transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//           console.error("Error sending email:", err);
//           return res.status(500).json({ error: "Failed to send reset email." });
//         } else {
//           console.log("Reset email sent:", info.response);
//           return res.json({
//             message: "If an account exists with that email, a reset link has been sent.",
//           });
//         }
//       });
//     } else {
//       // Always respond with success message to prevent revealing if an email exists or not.
//       return res.json({
//         message: "If an account exists with that email, a reset link has been sent.",
//       });
//     }
//   } catch (error) {
//     console.error("Error in password reset:", error);
//     next(error);
//   }
// });

require('dotenv').config();
const router = require('express').Router();
const { models: { User, Movie, UserMovie, UserRecommendation } } = require('../db');
module.exports = router;

const { S3Client } = require('@aws-sdk/client-s3'); // AWS SDK v3
const multer = require('multer');
const multerS3 = require('multer-s3');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
  console.error('Missing AWS environment variables. Ensure they are set in Heroku.');
}

// Set up multer for file uploads with S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'isAdmin', 'image'],
      include: [Movie],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

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

router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Movie],
      attributes: ['id', 'username', 'email', 'image', 'isAdmin'],
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

router.put('/:id/reset-password', async (req, res, next) => {
  try {
    // Check if the current user is an admin.
    // (This example assumes that you have middleware to populate req.user; adjust as needed.)
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied: admin credentials required' });
    }

    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's password; the model's hooks will hash the password
    await user.update({ password: newPassword });

    res.json({ message: `Password updated successfully for user ${id}` });
  } catch (error) {
    next(error);
  }
});

const crypto = require('crypto');
// const nodemailer = require('nodemailer');  // No longer needed for emailing the user

router.post('/reset-password', async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      // Instead of sending an email, mark that a reset has been requested.
      await user.update({ passwordResetRequested: true });

      // Optionally: If you want to notify the admin by email, you can set up nodemailer here to send an email to an admin address.

      console.log(`Password reset requested for user ${user.username} (${user.email})`);
    }
    // Always respond with a success message (so as not to reveal if an email exists)
    return res.json({
      message: "If an account exists with that email, your request has been sent to an admin. Please contact your administrator for further instructions.",
    });
  } catch (error) {
    console.error("Error in password reset:", error);
    next(error);
  }
});

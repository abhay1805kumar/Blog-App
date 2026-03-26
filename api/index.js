const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

// ✅ CORS fix (VERY IMPORTANT)
app.use(cors({
  credentials: true,
  origin: [
    "http://localhost:3000",
    "https://blog-app-three-smoky.vercel.app",
    "https://blog-app-qx3lglwqg-abhay1805kumars-projects.vercel.app"
  ]
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URL);

// ================= AUTH =================

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;

      // ✅ cookie fix for deploy
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      }).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (!token) return res.json(null);

  jwt.verify(token, secret, {}, (err,info) => {
    if (err) return res.json(null);
    res.json(info);
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  }).json('ok');
});

// ================= POSTS =================

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const ext = originalname.split('.').pop();
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;

  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) return res.status(401).json("Unauthorized");

    const {title,summary,content} = req.body;

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });

    res.json(postDoc);
  });
});

app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;

  if (req.file) {
    const {originalname,path} = req.file;
    const ext = originalname.split('.').pop();
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;

  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) return res.status(401).json("Unauthorized");

    const {id,title,summary,content} = req.body;

    const postDoc = await Post.findById(id);

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }

    await postDoc.update({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

// ✅ PORT fix
app.listen(process.env.PORT || 4000, () => {
  console.log("Server running...");
});

const { Router } = require('express');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch(e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const { body, user } = req;
    
    const updates = Object.keys(body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' });
    }

    try {
        updates.forEach(update => {
            user[update] = body[update];
        });
        await user.save();

        res.send(user);
    } catch (e) {
        console.log('---ERROR---');
        console.log(e);
        res.status(500).send(e);
    }
});

router.delete('/users/me', auth, async ({ user }, res) => {
    try {
        
        await user.remove();

        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

const upload = multer({
    limits: {
        fileSize: 1_048_576
    },
    fileFilter(_, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please, upload an image in format JPG, JPEG or PNG'));
        }

        callback(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    if (req.user.avatar) {
        req.user.avatar = undefined;
        await req.user.save();
        return res.send({ message: 'Avatar pic deleted' });
    }

    res.status(400).send({ error: 'There\'s no avatar' });
});

router.get('/users/:id/avatar', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);

        if (!user?.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch {
        res.status(400).send({ error: 'User doesn\'t exists or doesn\'t have an avatar' });
    }
});

module.exports = router;
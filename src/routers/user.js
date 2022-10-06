const { Router } = require('express');
const multer = require('multer');

const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new Router();

const upload = multer({
    dest: 'avatars'
});

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

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send();
});

module.exports = router;
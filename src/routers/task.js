const { Router } = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');

const router = new Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=5
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    const { completed, limit, skip, sortBy } = req.query;

    if (completed) {
        match.completed = completed === 'true';
    }

    if (sortBy) {
        const parts = sortBy.split(':');
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    try {
        // const tasks = await Task.find({ owner: req.user._id });
        const user = req.user;
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort,
            }
        });
        res.send(user.tasks);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task =  await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
    
        res.send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const body = req.body;

    const updates = Object.keys(body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid updates!"
        });
    }

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => {
            task[update] = body[update];
        });
        await task.save();

        res.send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

module.exports = router;
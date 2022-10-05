const express = require('express');
require('./db/mongoose');

// Routers
const  userRouter = require('./routers/user');
const  taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server running on port', port);
});

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
    // const task = await Task.findById('6335ff2ad34e84a6f2e57594');
    // await task.populate('owner');
    // console.log(task);

    // const user = await User.findById('63227bf4af3c8843c2e2b6f0');
    // await user.populate('tasks');
    // console.log(user.tasks);
}

main();
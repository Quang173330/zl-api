require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const {PORT} = require("./constants/constants");
const {MONGO_URI} = require("./constants/constants");
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app)
const request = require('request');
// connect to mongodb
mongoose.connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(res => {
    console.log("connected to mongodb");
})
    .catch(err => {
        console.log(err);
    })
// use middleware to parse body req to json
app.use(express.json({ limit: '50MB' }));

// use middleware to enable cors
app.use(cors());

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
server.listen(PORT);
io = require('socket.io')(server,{'pingTimeout':200000});
// route middleware
app.use("/", mainRouter);

app.get('/settings', function (req, res) {
    res.send('Settings Page');
});




// Socket.io chat realtime
io.on('connection', (socket) => {
    console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
    socket.on('sendMessage', message => {
        const token = message.token;
        const chatId = message.chatId;
        const content = message.content;

    });

    socket.emit('message', 'Hello world');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('join', info=>{
        socket.join(info)
    })
    socket.on('newMessage', msg => {
        request({
            url: 'http://localhost:8001/api/v1/chats/send',
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + msg.token,
            },
            body: JSON.stringify({
                type: msg.type,
                content: msg.content,
                chatId: msg.chatId,
            })
        }, async function (error, response){
            const res = JSON.parse(response.body)
            const message = res.data;
            message.chat = message.chat._id;
            io.to(msg.chatId).emit('onmessage', message);
        });
    })
});

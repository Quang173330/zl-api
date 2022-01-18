const chatController = require("../controllers/Chats");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const chatsRoutes = express.Router();
const auth = require("../middlewares/auth");

chatsRoutes.post(
    "/send",
    auth,
    asyncWrapper(chatController.send),
);

chatsRoutes.get(
    "/getMessages/:chatId",
    auth,
    asyncWrapper(chatController.getMessages),
);

chatsRoutes.get(
    "/getListChats",
    auth,
    asyncWrapper(chatController.getListChats),
);

chatsRoutes.post(
    "/getChatId",
    auth,
    asyncWrapper(chatController.getChatId)
)


module.exports = chatsRoutes;
const express = require("express");
const app = express();
const ws = require("ws");
const path = require("path");
const { WebSocketServer } = require("ws");

const PUBLIC = path.resolve(__dirname, "public");

app.use(express.static(PUBLIC));

const server = app.listen(3000);

const wss = new WebSocketServer({ server });
wss.on("connection", (socket) => {
	console.log("SOCKET WAS CREATED!!!! :d:::d");
	socket.onmessage = function () {
		console.log("I was hit!");
	};
});

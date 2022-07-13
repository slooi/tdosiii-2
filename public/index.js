console.log("index.js loaded");

const ws = new WebSocket(location.origin.replace(/^http/, "ws"));

ws.addEventListener("open", () => {
	console.log("websocket open!:D:D::D");
	ws.send("You getting this server!?");
});

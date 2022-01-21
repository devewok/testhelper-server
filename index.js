const express = require("express");
const cors = require("cors");
const {createServer} = require("http");
const {Server} = require("socket.io");

const app = express();
app.use(cors())
const httpServer = createServer(app);

const data = require("./data.js");
const test = data.demo

const io = new Server(httpServer, {
	cors: {
		origin: "https://testhelper-client.herokuapp.com",
		// origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	},
	path: "/api/",
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})
io.on("connection", (socket) => {
	socket.on("loaddata", (code) => {
		console.log("New helper, sending data")
		if (test[code])
			socket.emit("newquestion", test[code])
		else
			socket.emit("newquestion", {})
	})
	socket.on("newtest", (code) => {
		if (code !== "demo")
			test[code] = {}
	})
	socket.on("newquestion", ({question, code}) => {
		test[code][question.id] = {...question};
		socket.broadcast.emit("newquestion", test[code])
	})
	socket.on("ontovote", ({quid, opid, vote, code}) => {
		const id = test[code][quid].id
		test[code][quid][id]["options"][opid]["votes"] += vote;
		socket.broadcast.emit("newquestion", test[code])
	})
});
const port = process.env.PORT || 5000
// io.listen(port);
console.log("Server listening on " + port)
httpServer.listen(port)

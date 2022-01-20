const {Server} = require("socket.io");


const port = process.env.PORT || 5000
// io.listen(port);
console.log("Server listening on " + port)
const io = new Server(port, {
	cors: {
		origin: "https://testhelper-client.herokuapp.com",
		methods: ["GET", "POST"]
	},
	path: "/api/",
});
const test = {
	"demo": {
		"0": {
			"0": {
				"question": "Pregunta 1",
				"options": {
					"1": {
						"text": "Opcion 1",
						"votes": 0
					},
					"2": {
						"text": "Opcion 2",
						"votes": 0
					},
					"3": {
						"text": "Opcion 3",
						"votes": 0
					},
					"4": {
						"text": "Opcion 4",
						"votes": 0
					}
				}
			},
			"id": 0
		},
		"1": {
			"1": {
				"question": "Pregunta 1",
				"options": {
					"1": {
						"text": "Opcion 1",
						"votes": 0
					},
					"2": {
						"text": "Opcion 2",
						"votes": 0
					},
					"3": {
						"text": "Opcion 3",
						"votes": 0
					},
					"4": {
						"text": "Opcion 4",
						"votes": 0
					}
				}
			},
			"id": 1
		},
		"2": {
			"2": {
				"question": "Pregunta 1",
				"options": {
					"1": {
						"text": "Opcion 1",
						"votes": 0
					},
					"2": {
						"text": "Opcion 2",
						"votes": 0
					},
					"3": {
						"text": "Opcion 3",
						"votes": 0
					},
					"4": {
						"text": "Opcion 4",
						"votes": 0
					}
				}
			},
			"id": 2
		}
	}
}

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

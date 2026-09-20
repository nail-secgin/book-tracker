import express from "express";

const app = express();

app.get(
	"/",
	(req, res) => {
    res.json({
		message: "Hello BookTracker",
		version: 1
	});
})

app.listen(3000)
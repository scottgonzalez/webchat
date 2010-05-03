#!/usr/bin/env node
var sys = require("sys"),
	fs = require("fs"),
	chat = require('./lib/chat/server'),
	router = require("./lib/chat/router");

var chatServer = chat.createServer();
chatServer.listen(8001);

chatServer.addChannel({
	basePath: "/chat"
});

// server static web files
function serveFiles(localDir, webDir) {
	fs.readdirSync(localDir).forEach(function(file) {
		var local = localDir + "/" + file,
			web = webDir + "/" + file;
		
		if (fs.statSync(local).isDirectory()) {
			serveFiles(local, web);
		} else {
			chatServer.passThru(web, router.staticHandler(local));
		}
	});
}
serveFiles(__dirname + "/web", "");
chatServer.passThru("/", router.staticHandler(__dirname + "/web/index.html"));

#!/usr/bin/env node

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const weekOfYear = require('dayjs/plugin/weekOfYear');
const isoWeek = require('dayjs/plugin/isoWeek');
dayjs.extend(isoWeek)
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
let log_date_format = 'YYYY-MM-DD HH:mm:ss';
function log_time(){
	return dayjs().format(log_date_format);
}

const WebSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs'); 
 
const server = http.createServer(function(request, response) {
	console.log(log_time() + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});
server.listen(8080, function() {
	console.log(log_time() + ' Server is listening on port 8080');
});
 
wsServer = new WebSocketServer({
	httpServer: server,
	// You should not use autoAcceptConnections for production
	// applications, as it defeats all standard cross-origin protection
	// facilities built into the protocol and the browser.  You should
	// *always* verify the connection's origin and decide whether or not
	// to accept it.
	maxReceivedFrameSize: 1048576,
	autoAcceptConnections: false
});
console.log(wsServer);
 
function originIsAllowed(origin) {
	// put logic here to detect whether the specified origin is allowed.
	return true;
}

const messages = [];
const connections = [];
 
wsServer.on('request', function(request) {
	if (!originIsAllowed(request.origin)) {
		// Make sure we only accept requests from an allowed origin
		request.reject();
		console.log(log_time() + ' Connection from origin ' + request.origin + ' rejected.');
		return;
	}
	
	const connection = request.accept('echo-protocol', request.origin);
	console.log(log_time() + ' Connection accepted.');

	connection.on('message', function(message) {
		if (message.type === 'utf8') {
			// console.log('Received Message: ' + message.utf8Data);
			console.log(JSON.parse(message.utf8Data));
			connections.forEach(c => {
				c.sendUTF(message.utf8Data);
			});
		} else if (message.type === 'binary') {
			console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');

			const binaryData = message.binaryData;
			// connections.forEach(c => {
			// 	c.sendBytes(binaryData);
			// });
		}
	});
	connection.on('close', function(reasonCode, description) {
		console.log(log_time() + ' Peer ' + connection.remoteAddress + ' disconnected.');
	});

	connections.push(connection);
});
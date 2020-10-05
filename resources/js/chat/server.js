#!/usr/bin/env node
const { v4: uuidv4 } = require('uuid');

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
// const weekOfYear = require('dayjs/plugin/weekOfYear');
// const isoWeek = require('dayjs/plugin/isoWeek');
// dayjs.extend(isoWeek)
// dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);

let log_date_format = 'YYYY-MM-DD HH:mm:ss';
function log_time(){
	return dayjs().format(log_date_format);
}

const WebSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs');
const url = require('url');
 
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
});// console.log(wsServer);
 
function originIsAllowed(origin) {
	// put logic here to detect whether the specified origin is allowed.
	return true;
}

const maxLifeTime = 60;
function editable (message, connection){
	console.log(
		message.user_id, connection.user_id,
		(message.user_id === connection.user_id),
		!!message.time,
		dayjs().isSameOrBefore(
			dayjs(+message.time).add(maxLifeTime, 'second')
		)
	);
	return (message.user_id === connection.user_id) &&
		!!message.time &&
		dayjs().isSameOrBefore(
			dayjs(+message.time).add(maxLifeTime, 'second')
		)
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

	const parameters = url.parse(request.httpRequest.url, true);
	console.log(log_time() , parameters.query, request.httpRequest.url);

	connection.user_id = +parameters.query.user_id;

	// send all previous history
	connection.sendUTF(JSON.stringify(messages));

	connection.on('message', function(incoming) {
		if (incoming.type === 'utf8') {
			const message = JSON.parse(incoming.utf8Data);

			if(message.uuid){
				console.log('Edit ' + message.uuid);
				let _message = messages.find(m => m.uuid == message.uuid);
				if(_message && editable(_message, connection)){
					_message.text = message.text;
					message.edit = true;
				} else {
					return console.log('NOT EDITABLE!');
				}
			} else {
				console.log('New');
				message.uuid = uuidv4();
				message.time = +(new Date());
				messages.push(message);
			}
			console.log(message);

			connections.forEach(c => {
				c.sendUTF(JSON.stringify(message));
			});
		}/* else if (incoming.type === 'binary') {
			console.log('Received Binary Message of ' + incoming.binaryData.length + ' bytes');
			console.log(incoming);

			fs.writeFileSync("K://" + incoming.binaryData.length, incoming.binaryData);

			const binaryData = incoming.binaryData;
			connections.forEach(c => {
				// c.sendBytes(binaryData);
			});
		}*/
	});
	connection.on('close', function(reasonCode, description) {
		console.log(log_time() + ' Peer ' + connection.remoteAddress + ' disconnected.');
		connections.forEach((c,i) => {
			if(c.user_id == connection.user_id){
				// TODO: make a more reliable way of garbage collecting closed connections
				connections.splice(i, 1);
			}
		});
	});

	connections.push(connection);
	console.log(log_time() + ' Connections number is ' + connections.length + '.');
});
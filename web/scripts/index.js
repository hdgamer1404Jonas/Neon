const windowBaseURL = window.location.origin;
const apiBaseURL = `${windowBaseURL}/api`;
const wsURL = `ws://${window.location.hostname}:3001/ws`;

console.log(windowBaseURL);
console.log(apiBaseURL);
console.log(wsURL);

let ws = new WebSocket(wsURL);

ws.onopen = function() {
    console.log('WebSocket Client Connected');
}

ws.onmessage = function(e) {
    console.log("Received: '" + e.data + "'");
}

ws.onclose = function() {
    console.log("WebSocket Client Closed");
    location.reload();
}
/**
 * i wanted something to simulate "connection closed" and other edge-cases
 */
const { WebSocketServer } = require('ws');
const subscriptions = new Set();

const wss = new WebSocketServer({ port: 1234 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    let parsed = {};
    try {
      const stringData = new String(data);
      parsed = JSON.parse(stringData)
    }
    catch (e) {
      // malformed json sent. too bad
    }
    if (parsed.subscribe) {
      subscriptions.add(parsed.subscribe)
    } else if (parsed.unsubscribe) {
      subscriptions.delete(parsed.unsubscribe)
    }

    setInterval(() => {
      subscriptions.forEach(isin => {
        const price = isin.charCodeAt(1) + isin.charCodeAt(5);
        const d1 = isin.charCodeAt(7), d2 = isin.charCodeAt(8), d3 = isin.charCodeAt(9)
        ws.send(JSON.stringify({
          "isin": isin,
          "price": price + (Math.sin(Date.now()) * d1),
          "bid": 11.306359370403822 + (Math.sin(Date.now()) * d2),
          "ask": 11.326359370403821 + (Math.sin(Date.now()) * d3)
        }));
      })
    }, 2000)
  });
});
console.log('ws://localhost:1234/ bruh')
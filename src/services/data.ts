import { ISIN } from "./isin-helper";

export interface Response {
    isin: string,
    price: number,
    bid: number,
    ask: number
}

/* This was a real implementation to work with websockets */
export class WsWrapper {
    ws: WebSocket | null = null;
    serviceUrl: string;

    constructor(serviceUrl: string = 'ws://127.0.0.1:8080/') {
        this.serviceUrl = serviceUrl;
    }

    init(onMessage: Function, onClose?: Function, onError?: Function): Promise<void> {
        return new Promise((resolve) => {
            this.ws = new WebSocket(this.serviceUrl);
            this.ws.onopen = () => {
                resolve()
            };
            this.ws.onclose = function (event) {
                if (onClose) {
                    onClose(event.code, event.reason, event.wasClean)
                }
            };
            this.ws.onerror = function (error) {
                if (onError) {
                    onError(error)
                }
            };
            this.ws.onmessage = (message) => {
                let parsed;
                try {
                    parsed = JSON.parse(message.data)
                } catch (e) {
                    console.error('ws response was malformed')
                    console.error(e)
                }
                if (parsed) {
                    onMessage(parsed)
                }
            }
        })
    }

    subscribe(isin: ISIN): void {
        if (!this.ws) { throw new Error(`WebSocket wasnt initialized yet`) }
        else {
            this.ws.send(JSON.stringify({
                "subscribe": isin.value
            }))
        }
    }

    unsubscribe(isin: ISIN): void {
        if (!this.ws) { throw new Error(`WebSocket wasnt initialized yet`) }
        else {
            this.ws.send(JSON.stringify({
                "unsubscribe": isin.value
            }))
        }
    }
}

/* 
  This is just a client-side mock built around setInterval.
  This way i could deploy this to github pages or so
 */
export class WsMockWrapper extends WsWrapper {
    private subscriptions: string[] = [];
    
    init(onMessage: Function, onClose?: Function, onError?: Function): Promise<void> {
        setInterval(() => {
            this.subscriptions.forEach((isin: string) => {
                const price = isin.charCodeAt(1) + isin.charCodeAt(5);
                const d1 = isin.charCodeAt(7), d2 = isin.charCodeAt(8), d3 = isin.charCodeAt(9)
                const mockMessage = {
                    "isin": isin,
                    "price": price + (Math.sin(Date.now()) * d1),
                    "bid": 11.306359370403822 + (Math.sin(Date.now()) * d2),
                    "ask": 11.326359370403821 + (Math.sin(Date.now()) * d3)
                };
                setTimeout(() => {
                    onMessage(mockMessage)
                }, 160 * Math.random())
            })
        }, 450)
        return Promise.resolve();
    }

    subscribe(isin: ISIN): void {
        if (!this.subscriptions.includes(isin?.value)) {
            this.subscriptions.push(isin.value)
        }
    }

    unsubscribe(isin: ISIN): void {
        if (this.subscriptions.includes(isin?.value)) {
            this.subscriptions.splice(this.subscriptions.indexOf(isin?.value), 1)
        }
    }
}

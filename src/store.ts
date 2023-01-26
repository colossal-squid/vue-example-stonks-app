import { ActionContext } from "vuex";
import { Response, WsWrapper, WsMockWrapper} from "./services/data"
import { ISIN } from "./services/isin-helper";
type ConnectionStatus = 'CONNECTING' | 'ONLINE' | 'OFFLINE' | 'UNKNOWN';
export interface AppState {
    watchlist: Response[],
    subscriptions: ISIN[],
    lastUpdate: Date,
    status: ConnectionStatus,
    lastError?: string;
}

let ws: WsWrapper | null = null;

export default {
    state(): AppState {
        return {
            subscriptions: [],
            watchlist: [],
            status: 'UNKNOWN',
            lastUpdate: new Date(),
            lastError: ''
        }
    },
    mutations: {
        setLastUpdate (state: AppState, value: Date) {
            state.lastUpdate = value;
        },
        setStatus (state: AppState, status: ConnectionStatus) {
            state.status = status;
        },
        acceptMessage (state: AppState, message: Response) {
            if (!state.subscriptions.find( isin => isin.value === message.isin )) {
                // once "unsubscribed" there might still be 1 message incomming
                return;
            }
            const index = state.watchlist.findIndex(el => el.isin === message.isin)
            if (index !== -1) {
                state.watchlist[index] = message;
            } else {
                state.watchlist.push(message)
            }
        },
        addSubscription (state: AppState, isin: ISIN) {
            const set = new Set(state.subscriptions)
            set.add(isin)
            state.subscriptions = Array.from(set);
        },
        clearPosition (state: AppState, isin: ISIN) {
            const subscriptionIdx = state.subscriptions.findIndex(el => el.value === isin.value)
            if (subscriptionIdx !== 1) {
                state.subscriptions.splice(subscriptionIdx, 1);
            }
            const idx = (state.watchlist || []).findIndex((msg: Response) => msg.isin === isin.value)
            if (idx === -1) {
                console.error(`attempted to clear ${isin?.value}, but no subscriptions were found`)
            } else {
                (state.watchlist || []).splice(idx, 1)
            }
        },
        setLastError (state: AppState, error: string) {
            state.lastError = error;
        }
    },
    actions: {
        async init({ commit }: ActionContext<AppState, AppState>) {
            commit('setStatus', 'CONNECTING')
            if (ws) {
                throw new Error('INIT WAS ALREADY CALLED!')
            }
            window.addEventListener('offline', () => {
                commit('setStatus', 'OFFLINE')
            });
            ws = new WsMockWrapper();
            await ws.init((message: Response) => {
                commit('acceptMessage', message)
            }, (code: number, reason: string) => {
                commit('setStatus', 'OFFLINE')
                commit('setLastError', reason)
            }, (e: Event) => {
                commit('setStatus', 'OFFLINE')
                commit('setLastError', 'SERVER IS OFFLINE')
            })
            commit('setStatus', 'ONLINE')
            commit('setLastUpdate', new Date())
        },
        subscribe ({ commit }: ActionContext<AppState, AppState>, isin: ISIN) {
            if (!ws) {
                throw new Error(`Attempted to subscribe, but INIT wasn't called`)
            }
            commit('addSubscription', isin);
            ws.subscribe(isin)
        },
        unsubscribe ({ commit }: ActionContext<AppState, AppState>, isin: ISIN) {
            if (!ws) {
                throw new Error(`Attempted to unsubscribe, but INIT wasn't called`)
            }
            ws.unsubscribe(isin)
            commit('clearPosition', isin)
        }
    }
}
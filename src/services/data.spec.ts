import { describe, expect, it, vi } from 'vitest';

const mockWsImpl = {
    onopen: () => { },
    onmessage: (e: any) => { },
    onclose: (e: any) => { },
    onerror: (e: any) => { },
    send: vi.fn()
}

const WebSocketMock = vi.fn(() => (mockWsImpl))
vi.stubGlobal('WebSocket', WebSocketMock)

import { WsWrapper } from './data'
import { ISIN } from './isin-helper';
/**
 * @vitest-environment jsdom
 */
describe('WsWrapper', () => {
    it('can init and pass messages', async () => {
        const wrapper = new WsWrapper();
        expect(wrapper).toBeDefined();
        const onMessageCallback = vi.fn();
        const initPromise: Promise<void> = wrapper.init(onMessageCallback);
        mockWsImpl.onopen()
        await initPromise;
        const sampleResponse = { "hello": "world" };
        mockWsImpl.onmessage({ data: JSON.stringify(sampleResponse) })
        expect(onMessageCallback).toHaveBeenCalledWith(sampleResponse)
    })

    it('supports connection closed and error handling', async () => {
        const wrapper = new WsWrapper();
        const onMessageCallback = vi.fn(), connectionClosedCallback = vi.fn(), onErrorCallback = vi.fn();
        const initPromise: Promise<void> = wrapper.init(
            onMessageCallback,
            connectionClosedCallback,
            onErrorCallback
        );
        mockWsImpl.onopen()
        await initPromise;
        mockWsImpl.onclose({ wasClean: false, reason: 'test', code: 0})
        expect(connectionClosedCallback).toHaveBeenCalledWith(0, 'test', false)
        const error = {message: 'whoops'};
        mockWsImpl.onerror(error)
        expect(onErrorCallback).toHaveBeenCalledWith(error)
    })

    it('can subscribe for an ISIN', async () => {
        const wrapper = new WsWrapper();
        const initPromise: Promise<void> = wrapper.init(vi.fn());
        mockWsImpl.onopen()
        await initPromise;
        wrapper.subscribe({ value: 'DE000BASF111'} as ISIN)
        expect(mockWsImpl.send).toHaveBeenCalledWith(`{"subscribe":"DE000BASF111"}`)
    })

    it('can unsubscribe from an ISIN', async () => {
        const wrapper = new WsWrapper();
        const initPromise: Promise<void> = wrapper.init(vi.fn());
        mockWsImpl.onopen()
        await initPromise;
        wrapper.unsubscribe({ value: 'DE000BASF333'} as ISIN)
        expect(mockWsImpl.send).toHaveBeenCalledWith(`{"unsubscribe":"DE000BASF333"}`)
    })

    it('throws an error if init wasnt called', async () => {
        const wrapper = new WsWrapper();
        let error = null;
        try {
            wrapper.unsubscribe({ value: 'DE000BASF333'} as ISIN)
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined()
        error = null;
        try {
            wrapper.subscribe({ value: 'DE000BASF333'} as ISIN)
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined()
    })
})
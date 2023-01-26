import { createStore } from 'vuex'
import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils'
import { render, screen, fireEvent } from '@testing-library/vue'
import Watchlist from './Watchlist.vue'
import { AppState } from '../store';
import { ISIN } from '../services/isin-helper';

/**
 * @vitest-environment jsdom
 */
describe('Watchlist', () => {
    it('can render empty list', async () => {
        const mockStore = createStore({
            state(): AppState {
                return {
                    subscriptions: [],
                    watchlist: [],
                    status: 'UNKNOWN',
                    lastUpdate: new Date(),
                    lastError: ''
                }
            }
        })
        const wrapper = mount(Watchlist, {
            global: {
                plugins: [mockStore],
            },
        })
        const p = await wrapper.find("p");
        expect(p.text()).toContain('The list is empty')
    })

    it('can render list of items', async () => {
        const actions = {
            unsubscribe: vi.fn()
        }
        const mockStore = createStore({
            state(): AppState {
                return {
                    subscriptions: [
                        {value: 'DE000BASF111'} as ISIN,
                        {value: 'IT000BA2F111'} as ISIN,
                        {value: 'UK000BA3F111'} as ISIN,
                    ],
                    watchlist: [
                        {
                            "isin": "DE000BASF111",
                            "price": 15.316359370403822,
                            "bid": 15.306359370403822,
                            "ask": 15.326359370403821
                        },
                        {
                            "isin": "IT000BA2F111",
                            "price": 19.316359370403822,
                            "bid": 19.306359370403822,
                            "ask": 19.326359370403821
                        },{
                            "isin": "UK000BA3F111",
                            "price": 11.316359370403822,
                            "bid": 11.306359370403822,
                            "ask": 11.326359370403821
                        }
                    ],
                    status: 'UNKNOWN',
                    lastUpdate: new Date(),
                    lastError: ''
                }
            },
            actions
        })
        const wrapper = mount(Watchlist, {
            global: {
                plugins: [mockStore],
            },
        })
        const rows = await wrapper.findAll(".row");
        expect(rows.length).toBe(4)
        const btn = await rows[2].find('Button')
        await btn.trigger('click')
        expect(actions.unsubscribe).toHaveBeenCalledOnce()
    })
})
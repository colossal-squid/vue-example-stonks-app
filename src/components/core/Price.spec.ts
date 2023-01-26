import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue'
import Price from './Price.vue'

/**
 * @vitest-environment jsdom
 */
describe('Price', () => {
    it('can render', () => {
        const { unmount } = render(Price, {
            props: {
                value: 420
            }
        })
        expect(screen.queryAllByText('420.000€').length).toBe(1)
        unmount();
    })

    it('shows trend', async () => {
        const options = {
            props: {
                value: 421
            }
        };
        const { rerender, unmount, debug } =  render(Price, options)
        expect(screen.queryAllByText('421.000€').length).toBe(1)
        options.props.value = 422;
        await rerender(options.props)
        expect(screen.queryAllByText('422.000€').length).toBe(1)
        // trend gotta be UP
        expect(screen.queryAllByText('422.000€')[0].querySelector('.price--up')).toBeDefined()
        options.props.value = 400;
        await rerender(options.props)
        expect(screen.queryAllByText('400.000€').length).toBe(1)
        expect(screen.queryAllByText('400.000€')[0].querySelector('.price--down')).toBeDefined()
        unmount();
    })
})
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue'
import AddIsinForm from './AddIsinForm.vue'

/**
 * @vitest-environment jsdom
 */
describe('AddIsinForm', () => {
    it('can render', () => {
        const { unmount } = render(AddIsinForm);
        expect(screen.queryAllByText('Add to watchlist').length).toBe(1)
        expect(screen.queryAllByPlaceholderText('Paste your ISIN code here').length).toBe(1)
        unmount()
    })

    it('shows validation errors', async () => {
        const { unmount } = render(AddIsinForm);
        await fireEvent.update(
            screen.getByPlaceholderText('Paste your ISIN code here'),
        'Not a valid ISIN')

        expect(screen.queryAllByText(`Code you've entered has to be 12 digits`).length).toBe(1)
        await fireEvent.update(
            screen.getByPlaceholderText('Paste your ISIN code here'), 'U10378331005'
        )
        expect(screen.queryAllByText(`First two characters are not a valid country code`).length).toBe(1)

        await fireEvent.update(
            screen.getByPlaceholderText('Paste your ISIN code here'), 'U1037+331005'
        )
        expect(screen.queryAllByText(`National security identifier must only contain alphanumeric characters`).length).toBe(1)
        
        await fireEvent.update(
            screen.getByPlaceholderText('Paste your ISIN code here'), 'U1037+33100X'
        )
        expect(screen.queryAllByText(`Last character has to be a number`).length).toBe(1)

        await fireEvent.update(
            screen.getByPlaceholderText('Paste your ISIN code here'), 'UA0370331001'
        )
        expect(screen.queryAllByText(`Last character has to be a number`).length).toBe(0)
        expect(screen.queryAllByText(`National security identifier must only contain alphanumeric characters`).length).toBe(0)
        expect(screen.queryAllByText(`First two characters are not a valid country code`).length).toBe(0)
        expect(screen.queryAllByText(`Code you've entered has to be 12 digits`).length).toBe(0)

        unmount();
    })

    it('submits valid ISIN', async() => {
        const { unmount, emitted, debug } = render(AddIsinForm);
        await fireEvent.update(
            screen.getByPlaceholderText('Paste your ISIN code here'), 'U10370331001'
        )

        await fireEvent.click(screen.getByText('Add to watchlist'));
        expect(emitted()).not.toHaveProperty('subscribe')

        await fireEvent.update(
            screen.getByPlaceholderText('Paste your ISIN code here'), 'UK0370331001'
        )

        await fireEvent.click(screen.getByText('Add to watchlist'));
        expect(emitted()).toHaveProperty('subscribe')
        unmount();
    })
})
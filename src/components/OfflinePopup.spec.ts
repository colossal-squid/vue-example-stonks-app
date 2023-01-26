import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent} from '@testing-library/vue'
import OfflinePopup from './OfflinePopup.vue'

/**
 * @vitest-environment jsdom
 */
describe('OfflinePopup', () => {
    it('can render', () => {
        const { unmount } = render(OfflinePopup)
        expect(screen.queryAllByText('Technical Difficulties').length).toBe(1)
        unmount();
    })
    it('refreshes page when refresh is clicked', async () => {
        const { unmount, emitted } = render(OfflinePopup)
        expect(screen.queryAllByText('Reload').length).toBe(1)
        await fireEvent.click(screen.getByText('Reload'))
        expect(emitted()).toHaveProperty('reload')
        unmount();
    })
})
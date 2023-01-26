import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue'
import TextField from './TextField.vue'

/**
 * @vitest-environment jsdom
 */
describe('TextField', () => {
    it('can render', () => {
        render(TextField, {
            props: {
                placeholder: 'TextField test'
            }
        })
        expect(screen.queryAllByPlaceholderText('TextField test').length).toBe(1)
    })

    it('supports v-model', async () => {
        const props = {
            placeholder: 'TextField test2',
            modelValue: ''
        };
        const { emitted } = render(TextField, { props })
        await fireEvent.update(screen.getByPlaceholderText(props.placeholder), 'funny text')
        expect(emitted()).toHaveProperty('update:modelValue')
        expect(emitted()['update:modelValue'][0]).toStrictEqual(['funny text'])
    })

    it('emits @submit when Enter is pressed', async () => {
        const props = {
            placeholder: 'TextField test3',
            modelValue: 'model value'
        };
        const { emitted } = render(TextField, { props })
        await fireEvent.keyDown(screen.getByPlaceholderText(props.placeholder), { key: 'Enter' })
        expect(emitted()).toHaveProperty('submit')
    })
})
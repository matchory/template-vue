import App from '../src/App.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('App', () => {
    it('renders the greeting', () => {
        const wrapper = mount(App);

        expect(wrapper.get('[data-testid="greeting"]').text()).toBe('Hello, Matchory!');
    });
});

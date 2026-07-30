import { oxlintVue } from '@matchory/coding-style/oxlint/vue';

export default { ...oxlintVue, ignorePatterns: [...oxlintVue.ignorePatterns, 'dist', '.cache'] };

import { withVue } from '@matchory/coding-style/eslint/vue';
import { defineConfig } from 'eslint/config';
import { resolve } from 'node:path';

export default defineConfig(
    withVue({
        tailwindEntryPoint: resolve(import.meta.dirname, 'src/style.css'),
        unknownTailwindClasses: true,
    }),
);

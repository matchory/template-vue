import { withVue } from '@matchory/coding-style/eslint/vue';
import { defineConfig } from 'eslint/config';
import { resolve } from 'node:path';

// withVue() emits a config object carrying a raw `extends:` key once a
// tailwindEntryPoint is set, and ESLint's flat config system rejects `extends`
// outside of defineConfig(). Without this wrapper, `eslint` fails to start at
// all rather than merely reporting lint errors, so it must stay in place.
export default defineConfig(
    withVue({
        tailwindEntryPoint: resolve(import.meta.dirname, 'src/style.css'),
        // The shared preset defaults this to false, which silently disables
        // no-unknown-classes and leaves unrecognised Tailwind classes
        // unreported. Opting in here is what makes the Tailwind rules able to
        // fail a build; turning it off is only appropriate for a codebase
        // with pre-existing hand-written classes that would otherwise flood
        // the first lint run with errors.
        unknownTailwindClasses: true,
    }),
);

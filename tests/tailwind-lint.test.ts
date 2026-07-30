import { ESLint } from 'eslint';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Tailwind class linting', () => {
    it('reports an unknown Tailwind class through the real eslint.config.js', async () => {
        const eslint = new ESLint({
            cwd: resolve(import.meta.dirname, '..'),
            overrideConfigFile: resolve(import.meta.dirname, '../eslint.config.js'),
        });

        const results = await eslint.lintText(
            '<template>\n    <div class="not-a-real-class"></div>\n</template>\n',
            { filePath: resolve(import.meta.dirname, '../src/__fixture__.vue') },
        );

        const unknownClassMessages = results
            .flatMap((result) => result.messages)
            .filter((message) => message.ruleId === 'better-tailwindcss/no-unknown-classes');

        // This is the repository's only negative fixture: it fails if
        // `unknownTailwindClasses` is turned off, or if the Tailwind block in
        // eslint.config.js disappears entirely.
        expect(unknownClassMessages).toHaveLength(1);
        expect(unknownClassMessages[0]?.message).toContain('not-a-real-class');
    });
});

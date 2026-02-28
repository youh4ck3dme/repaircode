import { expect, test, describe } from 'vitest';
import { execSync } from 'child_process';

describe('Automated Lint Verification', () => {
    test('codebase passes ESLint check', () => {
        try {
            // Run eslint and catch output
            // We use --max-warnings 0 to ensure no warnings are allowed in "perfect" state
            const output = execSync('npm run lint', { stdio: 'pipe' }).toString();
            // If it reaches here without throwing, it's green
            expect(true).toBe(true);
        } catch (error) {
            const output = error.stdout ? error.stdout.toString() : error.message;
            // Fail the test with the linting output if any errors found
            throw new Error(`Linting failed:\n${output}`);
        }
    }, 20000);
});

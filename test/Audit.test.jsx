import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Audit from '../src/pages/Audit';

// Mock PremiumSelect since it has complex animations that might interfere with simple unit tests
vi.mock('../src/components/PremiumSelect', () => ({
    default: ({ options, onSelect, placeholder }) => (
        <div data-testid="premium-select">
            <select
                aria-label={placeholder}
                onChange={(e) => {
                    const opt = options.find(o => o.value === e.target.value);
                    if (opt) onSelect(opt);
                }}
            >
                <option value="">{placeholder}</option>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    )
}));

test('Audit form handles input and multi-selection logic', async () => {
    render(
        <BrowserRouter>
            <Audit />
        </BrowserRouter>
    );

    // Test basic input
    const nameInput = screen.getByPlaceholderText(/napr. Podnikový cloudový portál/i);
    fireEvent.change(nameInput, { target: { value: 'My Test Project', name: 'projectName' } });
    expect(nameInput.value).toBe('My Test Project');

    // Test tech stack toggle (multi-select)
    const reactBtn = screen.getByText('React');
    fireEvent.click(reactBtn);
    // It should have the active background class (bg-accent)
    expect(reactBtn).toHaveClass('bg-accent');

    fireEvent.click(reactBtn); // Toggle off
    expect(reactBtn).not.toHaveClass('bg-accent');

    // Test PremiumSelect integration
    const teamSelect = screen.getByLabelText(/Vyberte veľkosť tímu.../i);
    fireEvent.change(teamSelect, { target: { value: '6-10' } });

    // Test submission (mocked success state)
    const emailInput = screen.getByPlaceholderText(/name@company.com/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });

    // Need at least one tech and one pain point to enable submit
    fireEvent.click(screen.getByText('Node.js'));
    fireEvent.click(screen.getByText('Pomalý výkon'));

    const submitBtn = screen.getByText(/Odoslať žiadosť o globálnu analýzu/i);
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(screen.getByText('Žiadosť o audit odoslaná!')).toBeInTheDocument();
        expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    }, { timeout: 2000 });
});

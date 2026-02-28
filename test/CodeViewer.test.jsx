import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import CodeViewer from '../src/components/CodeSandbox/CodeViewer';

test('shows placeholder when no code provided', () => {
    render(<CodeViewer code={null} language="javascript" />);
    expect(screen.getByText('Pripravený na analýzu')).toBeInTheDocument();
    expect(screen.getByText('Vyberte súbor z prieskumníka na zobrazenie obsahu')).toBeInTheDocument();
});

test('renders code content properly', () => {
    render(<CodeViewer code="const a = 1;" language="javascript" />);
    // Check for parts of the code as SyntaxHighlighter might split it
    expect(screen.getByText(/const/)).toBeInTheDocument();
    expect(screen.getByText(/a/)).toBeInTheDocument();
});

test('shows binary file message when content is special placeholder', () => {
    render(<CodeViewer code="// Binary or unsupported file type" language="exe" />);
    expect(screen.getByText('// Binary or unsupported file type')).toBeInTheDocument();
});

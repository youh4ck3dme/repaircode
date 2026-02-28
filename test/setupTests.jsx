import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: React.forwardRef(({ children, ...props }, ref) => <div {...props} ref={ref}>{children}</div>),
        button: React.forwardRef(({ children, ...props }, ref) => <button {...props} ref={ref}>{children}</button>),
        span: React.forwardRef(({ children, ...props }, ref) => <span {...props} ref={ref}>{children}</span>),
        h1: React.forwardRef(({ children, ...props }, ref) => <h1 {...props} ref={ref}>{children}</h1>),
        p: React.forwardRef(({ children, ...props }, ref) => <p {...props} ref={ref}>{children}</p>),
        nav: React.forwardRef(({ children, ...props }, ref) => <nav {...props} ref={ref}>{children}</nav>),
        section: React.forwardRef(({ children, ...props }, ref) => <section {...props} ref={ref}>{children}</section>),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock other components if necessary to avoid complex animation issues
vi.mock('../src/components/ParticleBackground', () => ({
    default: () => <div data-testid="particle-bg" />
}));

vi.mock('../src/components/ShimmerText', () => ({
    default: ({ children }) => <span>{children}</span>
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import PremiumSelect from '../src/components/PremiumSelect';

const options = [
    { label: 'Option 1', value: 'opt1', icon: 'palette', color: '#ff0000' },
    { label: 'Option 2', value: 'opt2', icon: 'code', color: '#00ff00' },
    { label: 'Hidden Gem', value: 'gem', icon: 'gem', color: '#0000ff' }
];

test('PremiumSelect toggles dropdown and selects option', () => {
    const onSelect = vi.fn();
    render(<PremiumSelect options={options} onSelect={onSelect} placeholder="Select me" />);

    const trigger = screen.getByText('Select me');
    fireEvent.click(trigger);

    expect(screen.getByPlaceholderText('Search options...')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Option 1'));
    expect(onSelect).toHaveBeenCalledWith(options[0]);
    expect(screen.queryByPlaceholderText('Search options...')).not.toBeInTheDocument();
});

test('PremiumSelect filters options based on search term', () => {
    render(<PremiumSelect options={options} placeholder="Select me" />);
    fireEvent.click(screen.getByText('Select me'));

    const searchInput = screen.getByPlaceholderText('Search options...');
    fireEvent.change(searchInput, { target: { value: 'Hidden' } });

    expect(screen.getByText('Hidden Gem')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
});

test('PremiumSelect shows "No results found" when filter matches nothing', () => {
    render(<PremiumSelect options={options} placeholder="Select me" />);
    fireEvent.click(screen.getByText('Select me'));

    const searchInput = screen.getByPlaceholderText('Search options...');
    fireEvent.change(searchInput, { target: { value: 'XYZ' } });

    expect(screen.getByText('No results found!')).toBeInTheDocument();
});

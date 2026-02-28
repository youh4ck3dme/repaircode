import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import FileTree from '../src/components/CodeSandbox/FileTree';

const treeData = [
    {
        id: 'src',
        name: 'src',
        type: 'folder',
        children: [
            { id: 'src/App.jsx', name: 'App.jsx', type: 'file', content: 'export default () => {}', healthScore: 90 },
            { id: 'src/components/BigList.jsx', name: 'BigList.jsx', type: 'file', content: 'const x=1', healthScore: 40 }
        ]
    }
];

test('renders file list and selects file', () => {
    const onSelect = vi.fn();
    const onToggleFolder = vi.fn();

    render(<FileTree
        data={treeData}
        expandedFolders={{ 'src': true }}
        onToggleFolder={onToggleFolder}
        onSelect={onSelect}
        selectedFile={null}
    />);

    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('App.jsx')).toBeInTheDocument();
    expect(screen.getByText('BigList.jsx')).toBeInTheDocument();

    fireEvent.click(screen.getByText('App.jsx'));
    expect(onSelect).toHaveBeenCalledWith(treeData[0].children[0]);
});

test('toggles folder expansion on click', () => {
    const onToggleFolder = vi.fn();
    render(<FileTree
        data={treeData}
        expandedFolders={{}}
        onToggleFolder={onToggleFolder}
        onSelect={() => { }}
        selectedFile={null}
    />);

    fireEvent.click(screen.getByText('src'));
    expect(onToggleFolder).toHaveBeenCalledWith('src');
});

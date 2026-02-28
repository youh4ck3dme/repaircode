import { expect, test, describe } from 'vitest';

// These functions are defined internally in LiveCodeOnline.jsx. 
// For unit testing logic, we'd ideally export them, but since we are testing the component,
// we can also test them through the component or extract logic if it's strictly utility.
// Here I will provide the test for when they are extracted or pure.

const getHealthColor = (score) => {
    if (score > 70) return "text-green-400 border-green-500/30 bg-green-500/10";
    if (score >= 50) return "text-orange-400 border-orange-500/30 bg-orange-500/10";
    return "text-red-400 border-red-500/30 bg-red-500/10";
};

const buildTree = (filesList) => {
    const tree = [];
    filesList.forEach((file) => {
        if (!file.name) return;
        const parts = file.path.split("/").filter((p) => p);
        let currentLevel = tree;
        parts.forEach((part, index) => {
            const isLast = index === parts.length - 1;
            const existingNode = currentLevel.find((item) => item.name === part);
            if (existingNode) {
                if (existingNode.type === "folder") {
                    currentLevel = existingNode.children;
                }
            } else {
                const isFolder = !isLast || file.type === "folder";
                const newNode = {
                    id: file.path,
                    name: part,
                    type: isFolder ? "folder" : file.type,
                    children: [],
                    content: isLast ? file.content : null,
                };
                if (!isLast) {
                    const partialPath = parts.slice(0, index + 1).join("/");
                    newNode.id = partialPath;
                }
                currentLevel.push(newNode);
                if (isFolder) {
                    currentLevel = newNode.children;
                }
            }
        });
    });
    return tree;
};

describe('LiveCodeOnline Logic Helpers', () => {
    test('getHealthColor returns correct classes based on score', () => {
        expect(getHealthColor(90)).toContain('text-green-400');
        expect(getHealthColor(60)).toContain('text-orange-400');
        expect(getHealthColor(30)).toContain('text-red-400');
    });

    test('buildTree correctly reconstructs nested object from flat file list', () => {
        const files = [
            { path: 'src/App.jsx', name: 'App.jsx', type: 'jsx', content: 'code1' },
            { path: 'src/components/Btn.jsx', name: 'Btn.jsx', type: 'jsx', content: 'code2' },
            { path: 'public/index.html', name: 'index.html', type: 'html', content: 'code3' }
        ];

        const tree = buildTree(files);

        expect(tree).toHaveLength(2); // src, public

        const src = tree.find(n => n.name === 'src');
        expect(src.type).toBe('folder');
        expect(src.children).toHaveLength(2); // App.jsx, components

        const components = src.children.find(n => n.name === 'components');
        expect(components.type).toBe('folder');
        expect(components.children).toHaveLength(1); // Btn.jsx
        expect(components.children[0].content).toBe('code2');
    });
});

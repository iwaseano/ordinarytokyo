export default function wrapMarkdownTables() {
	return (tree) => {
		function visit(node) {
			if (!Array.isArray(node.children)) return;

			node.children = node.children.map((child) => {
				if (child.type === 'element' && child.tagName === 'table') {
					return {
						type: 'element',
						tagName: 'div',
						properties: { className: ['table-container'] },
						children: [
							{
								type: 'element',
								tagName: 'p',
								properties: { className: ['table-scroll-hint'] },
								children: [{ type: 'text', value: 'Scroll horizontally if needed to see the full table.' }],
							},
							{
								type: 'element',
								tagName: 'div',
								properties: {
									className: ['data-table-wrap'],
									role: 'group',
									ariaLabel: 'Table (scroll horizontally if needed)',
									tabIndex: 0,
								},
								children: [child],
							},
						],
					};
				}
				visit(child);
				return child;
			});
		}

		visit(tree);
	};
}

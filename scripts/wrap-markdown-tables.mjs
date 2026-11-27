export default function wrapMarkdownTables() {
	return (tree) => {
		function visit(node) {
			if (!Array.isArray(node.children)) return;

			node.children = node.children.map((child) => {
				if (child.type === 'element' && child.tagName === 'table') {
					return {
						type: 'element',
						tagName: 'div',
						properties: { className: ['data-table-wrap'] },
						children: [child],
					};
				}
				visit(child);
				return child;
			});
		}

		visit(tree);
	};
}

import { GRID_ROOT_GROUP_ID } from '@mui/x-data-grid';
import { getTreeNodeDescendants } from '@mui/x-data-grid/internals';
export function skipFiltering(rowTree) {
  const filteredRowsLookup = {};
  const filteredChildrenCountLookup = {};
  const filteredDescendantCountLookup = {};
  const nodes = Object.values(rowTree);
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    filteredRowsLookup[node.id] = true;
    filteredChildrenCountLookup[node.id] = node.serverChildrenCount ?? 0;
  }
  return {
    filteredRowsLookup,
    filteredChildrenCountLookup,
    filteredDescendantCountLookup
  };
}
export function skipSorting(rowTree) {
  return getTreeNodeDescendants(rowTree, GRID_ROOT_GROUP_ID, false);
}
import _extends from "@babel/runtime/helpers/esm/extends";
import { GRID_ROOT_GROUP_ID } from '@mui/x-data-grid';
import { isDeepEqual, getTreeNodeDescendants } from '@mui/x-data-grid/internals';
import { insertDataRowInTree } from "./insertDataRowInTree.js";
import { removeDataRowFromTree } from "./removeDataRowFromTree.js";
import { createUpdatedGroupsManager, getNodePathInTree } from "./utils.js";
export const updateRowTree = params => {
  const tree = _extends({}, params.previousTree);
  const treeDepths = _extends({}, params.previousTreeDepth);
  const updatedGroupsManager = createUpdatedGroupsManager();
  const groupsToFetch = params.previousGroupsToFetch ? new Set([...params.previousGroupsToFetch]) : new Set([]);
  for (let i = 0; i < params.nodes.inserted.length; i += 1) {
    const {
      id,
      path,
      serverChildrenCount
    } = params.nodes.inserted[i];
    insertDataRowInTree({
      previousTree: params.previousTree,
      tree,
      treeDepths,
      updatedGroupsManager,
      id,
      path,
      serverChildrenCount,
      onDuplicatePath: params.onDuplicatePath,
      isGroupExpandedByDefault: params.isGroupExpandedByDefault,
      defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth,
      groupsToFetch
    });
  }
  for (let i = 0; i < params.nodes.removed.length; i += 1) {
    const nodeId = params.nodes.removed[i];
    removeDataRowFromTree({
      tree,
      treeDepths,
      updatedGroupsManager,
      id: nodeId
    });
  }
  for (let i = 0; i < params.nodes.modified.length; i += 1) {
    const {
      id,
      path,
      serverChildrenCount
    } = params.nodes.modified[i];
    const pathInPreviousTree = getNodePathInTree({
      tree,
      id
    });
    const isInSameGroup = isDeepEqual(pathInPreviousTree, path);
    if (!isInSameGroup) {
      removeDataRowFromTree({
        tree,
        treeDepths,
        updatedGroupsManager,
        id
      });
      insertDataRowInTree({
        previousTree: params.previousTree,
        tree,
        treeDepths,
        updatedGroupsManager,
        id,
        path,
        serverChildrenCount,
        onDuplicatePath: params.onDuplicatePath,
        isGroupExpandedByDefault: params.isGroupExpandedByDefault,
        defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth,
        groupsToFetch
      });
    } else {
      updatedGroupsManager?.addAction(tree[id].parent, 'modifyChildren');
    }
  }

  // TODO rows v6: Avoid walking the whole tree, we should be able to generate the new list only using slices.
  const dataRowIds = getTreeNodeDescendants(tree, GRID_ROOT_GROUP_ID, true);
  return {
    tree,
    treeDepths,
    groupingName: params.groupingName,
    dataRowIds,
    updatedGroupsManager,
    groupsToFetch: Array.from(groupsToFetch)
  };
};
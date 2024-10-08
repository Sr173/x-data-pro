import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["hideDescendantCount"];
import * as React from 'react';
import { gridRowTreeSelector, useFirstRender, GRID_CHECKBOX_SELECTION_FIELD } from '@mui/x-data-grid';
import { useGridRegisterPipeProcessor, useGridRegisterStrategyProcessor } from '@mui/x-data-grid/internals';
import { GRID_TREE_DATA_GROUPING_COL_DEF, GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES } from "../treeData/gridTreeDataGroupColDef.js";
import { skipFiltering, skipSorting } from "./utils.js";
import { GridDataSourceTreeDataGroupingCell } from "../../../components/GridDataSourceTreeDataGroupingCell.js";
import { createRowTree } from "../../../utils/tree/createRowTree.js";
import { updateRowTree } from "../../../utils/tree/updateRowTree.js";
import { getVisibleRowsLookup } from "../../../utils/tree/utils.js";
import { jsx as _jsx } from "react/jsx-runtime";
const DATA_SOURCE_TREE_DATA_STRATEGY = 'dataSourceTreeData';
export const useGridDataSourceTreeDataPreProcessors = (privateApiRef, props) => {
  const setStrategyAvailability = React.useCallback(() => {
    privateApiRef.current.setStrategyAvailability('rowTree', DATA_SOURCE_TREE_DATA_STRATEGY, props.treeData && props.unstable_dataSource ? () => true : () => false);
  }, [privateApiRef, props.treeData, props.unstable_dataSource]);
  const getGroupingColDef = React.useCallback(() => {
    const groupingColDefProp = props.groupingColDef;
    let colDefOverride;
    if (typeof groupingColDefProp === 'function') {
      const params = {
        groupingName: DATA_SOURCE_TREE_DATA_STRATEGY,
        fields: []
      };
      colDefOverride = groupingColDefProp(params);
    } else {
      colDefOverride = groupingColDefProp;
    }
    const _ref = colDefOverride ?? {},
      {
        hideDescendantCount
      } = _ref,
      colDefOverrideProperties = _objectWithoutPropertiesLoose(_ref, _excluded);
    const commonProperties = _extends({}, GRID_TREE_DATA_GROUPING_COL_DEF, {
      renderCell: params => /*#__PURE__*/_jsx(GridDataSourceTreeDataGroupingCell, _extends({}, params, {
        hideDescendantCount: hideDescendantCount
      })),
      headerName: privateApiRef.current.getLocaleText('treeDataGroupingHeaderName')
    });
    return _extends({}, commonProperties, colDefOverrideProperties, GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES);
  }, [privateApiRef, props.groupingColDef]);
  const updateGroupingColumn = React.useCallback(columnsState => {
    if (!props.unstable_dataSource) {
      return columnsState;
    }
    const groupingColDefField = GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES.field;
    const shouldHaveGroupingColumn = props.treeData;
    const prevGroupingColumn = columnsState.lookup[groupingColDefField];
    if (shouldHaveGroupingColumn) {
      const newGroupingColumn = getGroupingColDef();
      if (prevGroupingColumn) {
        newGroupingColumn.width = prevGroupingColumn.width;
        newGroupingColumn.flex = prevGroupingColumn.flex;
      }
      columnsState.lookup[groupingColDefField] = newGroupingColumn;
      if (prevGroupingColumn == null) {
        const index = columnsState.orderedFields[0] === GRID_CHECKBOX_SELECTION_FIELD ? 1 : 0;
        columnsState.orderedFields = [...columnsState.orderedFields.slice(0, index), groupingColDefField, ...columnsState.orderedFields.slice(index)];
      }
    } else if (!shouldHaveGroupingColumn && prevGroupingColumn) {
      delete columnsState.lookup[groupingColDefField];
      columnsState.orderedFields = columnsState.orderedFields.filter(field => field !== groupingColDefField);
    }
    return columnsState;
  }, [props.treeData, props.unstable_dataSource, getGroupingColDef]);
  const createRowTreeForTreeData = React.useCallback(params => {
    const getGroupKey = props.unstable_dataSource?.getGroupKey;
    if (!getGroupKey) {
      throw new Error('MUI X: No `getGroupKey` method provided with the dataSource.');
    }
    const getChildrenCount = props.unstable_dataSource?.getChildrenCount;
    if (!getChildrenCount) {
      throw new Error('MUI X: No `getChildrenCount` method provided with the dataSource.');
    }
    const parentPath = params.updates.groupKeys ?? [];
    const getRowTreeBuilderNode = rowId => {
      const count = getChildrenCount(params.dataRowIdToModelLookup[rowId]);
      return {
        id: rowId,
        path: [...parentPath, getGroupKey(params.dataRowIdToModelLookup[rowId])].map(key => ({
          key,
          field: null
        })),
        serverChildrenCount: count
      };
    };
    const onDuplicatePath = (firstId, secondId, path) => {
      throw new Error(['MUI X: The values returned by `getGroupKey` for all the sibling rows should be unique.', `The rows with id #${firstId} and #${secondId} have the same.`, `Path: ${JSON.stringify(path.map(step => step.key))}.`].join('\n'));
    };
    if (params.updates.type === 'full') {
      return createRowTree({
        previousTree: params.previousTree,
        nodes: params.updates.rows.map(getRowTreeBuilderNode),
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: DATA_SOURCE_TREE_DATA_STRATEGY,
        onDuplicatePath
      });
    }
    return updateRowTree({
      nodes: {
        inserted: params.updates.actions.insert.map(getRowTreeBuilderNode),
        modified: params.updates.actions.modify.map(getRowTreeBuilderNode),
        removed: params.updates.actions.remove
      },
      previousTree: params.previousTree,
      previousGroupsToFetch: params.previousGroupsToFetch,
      previousTreeDepth: params.previousTreeDepths,
      defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
      isGroupExpandedByDefault: props.isGroupExpandedByDefault,
      groupingName: DATA_SOURCE_TREE_DATA_STRATEGY
    });
  }, [props.unstable_dataSource, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault]);
  const filterRows = React.useCallback(() => {
    const rowTree = gridRowTreeSelector(privateApiRef);
    return skipFiltering(rowTree);
  }, [privateApiRef]);
  const sortRows = React.useCallback(() => {
    const rowTree = gridRowTreeSelector(privateApiRef);
    return skipSorting(rowTree);
  }, [privateApiRef]);
  useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterStrategyProcessor(privateApiRef, DATA_SOURCE_TREE_DATA_STRATEGY, 'rowTreeCreation', createRowTreeForTreeData);
  useGridRegisterStrategyProcessor(privateApiRef, DATA_SOURCE_TREE_DATA_STRATEGY, 'filtering', filterRows);
  useGridRegisterStrategyProcessor(privateApiRef, DATA_SOURCE_TREE_DATA_STRATEGY, 'sorting', sortRows);
  useGridRegisterStrategyProcessor(privateApiRef, DATA_SOURCE_TREE_DATA_STRATEGY, 'visibleRowsLookupCreation', getVisibleRowsLookup);

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    setStrategyAvailability();
  });

  /**
   * EFFECTS
   */
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (!isFirstRender.current) {
      setStrategyAvailability();
    } else {
      isFirstRender.current = false;
    }
  }, [setStrategyAvailability]);
};
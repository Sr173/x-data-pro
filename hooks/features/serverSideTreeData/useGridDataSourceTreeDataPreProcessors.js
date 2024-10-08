"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridDataSourceTreeDataPreProcessors = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _xDataGrid = require("@mui/x-data-grid");
var _internals = require("@mui/x-data-grid/internals");
var _gridTreeDataGroupColDef = require("../treeData/gridTreeDataGroupColDef");
var _utils = require("./utils");
var _GridDataSourceTreeDataGroupingCell = require("../../../components/GridDataSourceTreeDataGroupingCell");
var _createRowTree = require("../../../utils/tree/createRowTree");
var _updateRowTree = require("../../../utils/tree/updateRowTree");
var _utils2 = require("../../../utils/tree/utils");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["hideDescendantCount"];
const DATA_SOURCE_TREE_DATA_STRATEGY = 'dataSourceTreeData';
const useGridDataSourceTreeDataPreProcessors = (privateApiRef, props) => {
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
      colDefOverrideProperties = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
    const commonProperties = (0, _extends2.default)({}, _gridTreeDataGroupColDef.GRID_TREE_DATA_GROUPING_COL_DEF, {
      renderCell: params => /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridDataSourceTreeDataGroupingCell.GridDataSourceTreeDataGroupingCell, (0, _extends2.default)({}, params, {
        hideDescendantCount: hideDescendantCount
      })),
      headerName: privateApiRef.current.getLocaleText('treeDataGroupingHeaderName')
    });
    return (0, _extends2.default)({}, commonProperties, colDefOverrideProperties, _gridTreeDataGroupColDef.GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES);
  }, [privateApiRef, props.groupingColDef]);
  const updateGroupingColumn = React.useCallback(columnsState => {
    if (!props.unstable_dataSource) {
      return columnsState;
    }
    const groupingColDefField = _gridTreeDataGroupColDef.GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES.field;
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
        const index = columnsState.orderedFields[0] === _xDataGrid.GRID_CHECKBOX_SELECTION_FIELD ? 1 : 0;
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
      return (0, _createRowTree.createRowTree)({
        previousTree: params.previousTree,
        nodes: params.updates.rows.map(getRowTreeBuilderNode),
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: DATA_SOURCE_TREE_DATA_STRATEGY,
        onDuplicatePath
      });
    }
    return (0, _updateRowTree.updateRowTree)({
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
    const rowTree = (0, _xDataGrid.gridRowTreeSelector)(privateApiRef);
    return (0, _utils.skipFiltering)(rowTree);
  }, [privateApiRef]);
  const sortRows = React.useCallback(() => {
    const rowTree = (0, _xDataGrid.gridRowTreeSelector)(privateApiRef);
    return (0, _utils.skipSorting)(rowTree);
  }, [privateApiRef]);
  (0, _internals.useGridRegisterPipeProcessor)(privateApiRef, 'hydrateColumns', updateGroupingColumn);
  (0, _internals.useGridRegisterStrategyProcessor)(privateApiRef, DATA_SOURCE_TREE_DATA_STRATEGY, 'rowTreeCreation', createRowTreeForTreeData);
  (0, _internals.useGridRegisterStrategyProcessor)(privateApiRef, DATA_SOURCE_TREE_DATA_STRATEGY, 'filtering', filterRows);
  (0, _internals.useGridRegisterStrategyProcessor)(privateApiRef, DATA_SOURCE_TREE_DATA_STRATEGY, 'sorting', sortRows);
  (0, _internals.useGridRegisterStrategyProcessor)(privateApiRef, DATA_SOURCE_TREE_DATA_STRATEGY, 'visibleRowsLookupCreation', _utils2.getVisibleRowsLookup);

  /**
   * 1ST RENDER
   */
  (0, _xDataGrid.useFirstRender)(() => {
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
exports.useGridDataSourceTreeDataPreProcessors = useGridDataSourceTreeDataPreProcessors;
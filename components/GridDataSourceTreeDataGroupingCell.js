"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridDataSourceTreeDataGroupingCell = GridDataSourceTreeDataGroupingCell;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Badge = _interopRequireDefault(require("@mui/material/Badge"));
var _xDataGrid = require("@mui/x-data-grid");
var _internals = require("@mui/x-data-grid/internals");
var _CircularProgress = _interopRequireDefault(require("@mui/material/CircularProgress"));
var _useGridRootProps = require("../hooks/utils/useGridRootProps");
var _useGridPrivateApiContext = require("../hooks/utils/useGridPrivateApiContext");
var _gridDataSourceSelector = require("../hooks/features/dataSource/gridDataSourceSelector");
var _jsxRuntime = require("react/jsx-runtime");
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle'],
    loadingContainer: ['treeDataGroupingCellLoadingContainer']
  };
  return (0, _composeClasses.default)(slots, _xDataGrid.getDataGridUtilityClass, classes);
};
function GridTreeDataGroupingCellIcon(props) {
  const apiRef = (0, _useGridPrivateApiContext.useGridPrivateApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const classes = useUtilityClasses(rootProps);
  const {
    rowNode,
    id,
    field,
    descendantCount
  } = props;
  const isDataLoading = (0, _internals.useGridSelectorV8)(apiRef, _gridDataSourceSelector.gridDataSourceLoadingIdSelector, id);
  const error = (0, _internals.useGridSelectorV8)(apiRef, _gridDataSourceSelector.gridDataSourceErrorSelector, id);
  const handleClick = event => {
    if (!rowNode.childrenExpanded) {
      // always fetch/get from cache the children when the node is expanded
      apiRef.current.unstable_dataSource.fetchRows(id);
    } else {
      apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    }
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation(); // TODO remove event.stopPropagation
  };
  const Icon = rowNode.childrenExpanded ? rootProps.slots.treeDataCollapseIcon : rootProps.slots.treeDataExpandIcon;
  if (isDataLoading) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.loadingContainer,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CircularProgress.default, {
        size: "1rem",
        color: "inherit"
      })
    });
  }
  return descendantCount > 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseIconButton, (0, _extends2.default)({
    size: "small",
    onClick: handleClick,
    tabIndex: -1,
    "aria-label": rowNode.childrenExpanded ? apiRef.current.getLocaleText('treeDataCollapse') : apiRef.current.getLocaleText('treeDataExpand')
  }, rootProps?.slotProps?.baseIconButton, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseTooltip, {
      title: error?.message ?? null,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Badge.default, {
        variant: "dot",
        color: "error",
        invisible: !error,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Icon, {
          fontSize: "inherit"
        })
      })
    })
  })) : null;
}
function GridDataSourceTreeDataGroupingCell(props) {
  const {
    id,
    field,
    formattedValue,
    rowNode,
    hideDescendantCount,
    offsetMultiplier = 2
  } = props;
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const apiRef = (0, _useGridPrivateApiContext.useGridPrivateApiContext)();
  const rowSelector = state => state.rows.dataRowIdToModelLookup[id];
  const row = (0, _xDataGrid.useGridSelector)(apiRef, rowSelector);
  const classes = useUtilityClasses(rootProps);
  let descendantCount = 0;
  if (row) {
    descendantCount = Math.max(rootProps.unstable_dataSource?.getChildrenCount?.(row) ?? 0, 0);
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
    className: classes.root,
    sx: {
      ml: rowNode.depth * offsetMultiplier
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.toggle,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(GridTreeDataGroupingCellIcon, {
        id: id,
        field: field,
        rowNode: rowNode,
        row: row,
        descendantCount: descendantCount
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
      children: [formattedValue === undefined ? rowNode.groupingKey : formattedValue, !hideDescendantCount && descendantCount > 0 ? ` (${descendantCount})` : '']
    })]
  });
}
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridTreeDataGroupingCell = GridTreeDataGroupingCell;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _xDataGrid = require("@mui/x-data-grid");
var _useGridRootProps = require("../hooks/utils/useGridRootProps");
var _useGridApiContext = require("../hooks/utils/useGridApiContext");
var _jsxRuntime = require("react/jsx-runtime");
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle']
  };
  return (0, _composeClasses.default)(slots, _xDataGrid.getDataGridUtilityClass, classes);
};
function GridTreeDataGroupingCell(props) {
  const {
    id,
    field,
    formattedValue,
    rowNode,
    hideDescendantCount,
    offsetMultiplier = 2
  } = props;
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const classes = useUtilityClasses(rootProps);
  const filteredDescendantCountLookup = (0, _xDataGrid.useGridSelector)(apiRef, _xDataGrid.gridFilteredDescendantCountLookupSelector);
  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;
  const Icon = rowNode.childrenExpanded ? rootProps.slots.treeDataCollapseIcon : rootProps.slots.treeDataExpandIcon;
  const handleClick = event => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation(); // TODO remove event.stopPropagation
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
    className: classes.root,
    sx: {
      ml: rowNode.depth * offsetMultiplier
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.toggle,
      children: filteredDescendantCount > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseIconButton, (0, _extends2.default)({
        size: "small",
        onClick: handleClick,
        tabIndex: -1,
        "aria-label": rowNode.childrenExpanded ? apiRef.current.getLocaleText('treeDataCollapse') : apiRef.current.getLocaleText('treeDataExpand')
      }, rootProps?.slotProps?.baseIconButton, {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Icon, {
          fontSize: "inherit"
        })
      }))
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
      children: [formattedValue === undefined ? rowNode.groupingKey : formattedValue, !hideDescendantCount && filteredDescendantCount > 0 ? ` (${filteredDescendantCount})` : '']
    })]
  });
}
process.env.NODE_ENV !== "production" ? GridTreeDataGroupingCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: _propTypes.default.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: _propTypes.default.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: _propTypes.default.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: _propTypes.default.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.shape({
      focus: _propTypes.default.func.isRequired
    })
  })]),
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: _propTypes.default.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: _propTypes.default.bool.isRequired,
  hideDescendantCount: _propTypes.default.bool,
  /**
   * The grid row id.
   */
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: _propTypes.default.bool,
  /**
   * The cell offset multiplier used for calculating cell offset (`rowNode.depth * offsetMultiplier` px).
   * @default 2
   */
  offsetMultiplier: _propTypes.default.number,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: _propTypes.default.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: _propTypes.default.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: _propTypes.default.any
} : void 0;
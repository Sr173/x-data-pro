"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridPinnedRows = GridPinnedRows;
var React = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _xDataGrid = require("@mui/x-data-grid");
var _internals = require("@mui/x-data-grid/internals");
var _jsxRuntime = require("react/jsx-runtime");
const useUtilityClasses = () => {
  const slots = {
    root: ['pinnedRows']
  };
  return (0, _composeClasses.default)(slots, _xDataGrid.getDataGridUtilityClass, {});
};
function GridPinnedRows({
  position,
  virtualScroller
}) {
  const classes = useUtilityClasses();
  const apiRef = (0, _internals.useGridPrivateApiContext)();
  const renderContext = (0, _xDataGrid.useGridSelector)(apiRef, _internals.gridRenderContextSelector);
  const pinnedRowsData = (0, _xDataGrid.useGridSelector)(apiRef, _internals.gridPinnedRowsSelector);
  const rows = pinnedRowsData[position];
  const pinnedRenderContext = React.useMemo(() => ({
    firstRowIndex: 0,
    lastRowIndex: rows.length,
    firstColumnIndex: renderContext.firstColumnIndex,
    lastColumnIndex: renderContext.lastColumnIndex
  }), [rows, renderContext.firstColumnIndex, renderContext.lastColumnIndex]);
  if (rows.length === 0) {
    return null;
  }
  const pinnedRows = virtualScroller.getRows({
    position,
    rows,
    renderContext: pinnedRenderContext
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: (0, _clsx.default)(classes.root, _xDataGrid.gridClasses[`pinnedRows--${position}`]),
    role: "presentation",
    children: pinnedRows
  });
}
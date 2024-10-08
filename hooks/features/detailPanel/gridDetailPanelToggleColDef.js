"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GRID_DETAIL_PANEL_TOGGLE_FIELD = exports.GRID_DETAIL_PANEL_TOGGLE_COL_DEF = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _xDataGrid = require("@mui/x-data-grid");
var _GridDetailPanelToggleCell = require("../../../components/GridDetailPanelToggleCell");
var _gridDetailPanelSelector = require("./gridDetailPanelSelector");
var _jsxRuntime = require("react/jsx-runtime");
const GRID_DETAIL_PANEL_TOGGLE_FIELD = exports.GRID_DETAIL_PANEL_TOGGLE_FIELD = '__detail_panel_toggle__';
const GRID_DETAIL_PANEL_TOGGLE_COL_DEF = exports.GRID_DETAIL_PANEL_TOGGLE_COL_DEF = (0, _extends2.default)({}, _xDataGrid.GRID_STRING_COL_DEF, {
  type: 'custom',
  field: GRID_DETAIL_PANEL_TOGGLE_FIELD,
  editable: false,
  sortable: false,
  filterable: false,
  resizable: false,
  // @ts-ignore
  aggregable: false,
  disableColumnMenu: true,
  disableReorder: true,
  disableExport: true,
  align: 'left',
  width: 40,
  valueGetter: (value, row, column, apiRef) => {
    const rowId = apiRef.current.getRowId(row);
    const expandedRowIds = (0, _gridDetailPanelSelector.gridDetailPanelExpandedRowIdsSelector)(apiRef.current.state);
    return expandedRowIds.includes(rowId);
  },
  renderCell: params => /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridDetailPanelToggleCell.GridDetailPanelToggleCell, (0, _extends2.default)({}, params)),
  renderHeader: ({
    colDef
  }) => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    "aria-label": colDef.headerName
  })
});
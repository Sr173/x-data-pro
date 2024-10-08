"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridProColumnMenu = exports.GRID_COLUMN_MENU_SLOT_PROPS_PRO = exports.GRID_COLUMN_MENU_SLOTS_PRO = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _xDataGrid = require("@mui/x-data-grid");
var _GridColumnMenuPinningItem = require("./GridColumnMenuPinningItem");
var _jsxRuntime = require("react/jsx-runtime");
const GRID_COLUMN_MENU_SLOTS_PRO = exports.GRID_COLUMN_MENU_SLOTS_PRO = (0, _extends2.default)({}, _xDataGrid.GRID_COLUMN_MENU_SLOTS, {
  columnMenuPinningItem: _GridColumnMenuPinningItem.GridColumnMenuPinningItem
});
const GRID_COLUMN_MENU_SLOT_PROPS_PRO = exports.GRID_COLUMN_MENU_SLOT_PROPS_PRO = (0, _extends2.default)({}, _xDataGrid.GRID_COLUMN_MENU_SLOT_PROPS, {
  columnMenuPinningItem: {
    displayOrder: 15
  }
});
const GridProColumnMenu = exports.GridProColumnMenu = /*#__PURE__*/React.forwardRef(function GridProColumnMenu(props, ref) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_xDataGrid.GridGenericColumnMenu, (0, _extends2.default)({
    ref: ref
  }, props, {
    defaultSlots: GRID_COLUMN_MENU_SLOTS_PRO,
    defaultSlotProps: GRID_COLUMN_MENU_SLOT_PROPS_PRO
  }));
});
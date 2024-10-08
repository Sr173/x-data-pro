"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridHeaderFilterClearButton = GridHeaderFilterClearButton;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
const sx = {
  padding: '2px'
};
function GridHeaderFilterClearButton(props) {
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.baseIconButton, (0, _extends2.default)({
    tabIndex: -1,
    "aria-label": "Clear filter",
    size: "small",
    sx: sx
  }, props, rootProps.slotProps?.baseIconButton, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.columnMenuClearIcon, {
      fontSize: "inherit"
    })
  }));
}
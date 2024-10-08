"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridHeaderFilterMenu = GridHeaderFilterMenu;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _MenuList = _interopRequireDefault(require("@mui/material/MenuList"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _utils = require("@mui/utils");
var _xDataGrid = require("@mui/x-data-grid");
var _jsxRuntime = require("react/jsx-runtime");
function GridHeaderFilterMenu({
  open,
  field,
  target,
  applyFilterChanges,
  operators,
  item,
  id,
  labelledBy
}) {
  const apiRef = (0, _xDataGrid.useGridApiContext)();
  const hideMenu = React.useCallback(() => {
    apiRef.current.hideHeaderFilterMenu();
  }, [apiRef]);
  const handleListKeyDown = React.useCallback(event => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    if (event.key === 'Escape' || event.key === 'Tab') {
      hideMenu();
    }
  }, [hideMenu]);
  if (!target) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_xDataGrid.GridMenu, {
    placement: "bottom-end",
    open: open,
    target: target,
    onClose: hideMenu,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuList.default, {
      "aria-labelledby": labelledBy,
      id: id,
      onKeyDown: handleListKeyDown,
      children: operators.map((op, i) => {
        const label = op?.headerLabel ?? apiRef.current.getLocaleText(`headerFilterOperator${(0, _utils.unstable_capitalize)(op.value)}`);
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
          onClick: () => {
            applyFilterChanges((0, _extends2.default)({}, item, {
              operator: op.value
            }));
            hideMenu();
          },
          autoFocus: i === 0 ? open : false,
          selected: op.value === item.operator,
          children: label
        }, `${field}-${op.value}`);
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? GridHeaderFilterMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  applyFilterChanges: _propTypes.default.func.isRequired,
  field: _propTypes.default.string.isRequired,
  id: _propTypes.default.string.isRequired,
  item: _propTypes.default.shape({
    field: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    operator: _propTypes.default.string.isRequired,
    value: _propTypes.default.any
  }).isRequired,
  labelledBy: _propTypes.default.string.isRequired,
  open: _propTypes.default.bool.isRequired,
  operators: _propTypes.default.arrayOf(_propTypes.default.shape({
    getApplyFilterFn: _propTypes.default.func.isRequired,
    getValueAsString: _propTypes.default.func,
    headerLabel: _propTypes.default.string,
    InputComponent: _propTypes.default.elementType,
    InputComponentProps: _propTypes.default.object,
    label: _propTypes.default.string,
    requiresFilterValue: _propTypes.default.bool,
    value: _propTypes.default.string.isRequired
  })).isRequired,
  target: _utils.HTMLElementType
} : void 0;
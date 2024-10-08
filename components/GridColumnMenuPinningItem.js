"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnMenuPinningItem = GridColumnMenuPinningItem;
var React = _interopRequireWildcard(require("react"));
var _RtlProvider = require("@mui/system/RtlProvider");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _ListItemIcon = _interopRequireDefault(require("@mui/material/ListItemIcon"));
var _ListItemText = _interopRequireDefault(require("@mui/material/ListItemText"));
var _xDataGrid = require("@mui/x-data-grid");
var _useGridApiContext = require("../hooks/utils/useGridApiContext");
var _useGridRootProps = require("../hooks/utils/useGridRootProps");
var _jsxRuntime = require("react/jsx-runtime");
function GridColumnMenuPinningItem(props) {
  const {
    colDef,
    onClick
  } = props;
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const isRtl = (0, _RtlProvider.useRtl)();
  const pinColumn = React.useCallback(side => event => {
    apiRef.current.pinColumn(colDef.field, side);
    onClick(event);
  }, [apiRef, colDef.field, onClick]);
  const unpinColumn = event => {
    apiRef.current.unpinColumn(colDef.field);
    onClick(event);
  };
  const pinToLeftMenuItem = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_MenuItem.default, {
    onClick: pinColumn(_xDataGrid.GridPinnedColumnPosition.LEFT),
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemIcon.default, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.columnMenuPinLeftIcon, {
        fontSize: "small"
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemText.default, {
      children: apiRef.current.getLocaleText('pinToLeft')
    })]
  });
  const pinToRightMenuItem = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_MenuItem.default, {
    onClick: pinColumn(_xDataGrid.GridPinnedColumnPosition.RIGHT),
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemIcon.default, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.slots.columnMenuPinRightIcon, {
        fontSize: "small"
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemText.default, {
      children: apiRef.current.getLocaleText('pinToRight')
    })]
  });
  if (!colDef) {
    return null;
  }
  const side = apiRef.current.isColumnPinned(colDef.field);
  if (side) {
    const otherSide = side === _xDataGrid.GridPinnedColumnPosition.RIGHT ? _xDataGrid.GridPinnedColumnPosition.LEFT : _xDataGrid.GridPinnedColumnPosition.RIGHT;
    const label = otherSide === _xDataGrid.GridPinnedColumnPosition.RIGHT ? 'pinToRight' : 'pinToLeft';
    const Icon = side === _xDataGrid.GridPinnedColumnPosition.RIGHT ? rootProps.slots.columnMenuPinLeftIcon : rootProps.slots.columnMenuPinRightIcon;
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_MenuItem.default, {
        onClick: pinColumn(otherSide),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemIcon.default, {
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Icon, {
            fontSize: "small"
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemText.default, {
          children: apiRef.current.getLocaleText(label)
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_MenuItem.default, {
        onClick: unpinColumn,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemIcon.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ListItemText.default, {
          children: apiRef.current.getLocaleText('unpin')
        })]
      })]
    });
  }
  if (isRtl) {
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
      children: [pinToRightMenuItem, pinToLeftMenuItem]
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [pinToLeftMenuItem, pinToRightMenuItem]
  });
}
process.env.NODE_ENV !== "production" ? GridColumnMenuPinningItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: _propTypes.default.object.isRequired,
  onClick: _propTypes.default.func.isRequired
} : void 0;
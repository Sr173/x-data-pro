import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GridGenericColumnMenu, GRID_COLUMN_MENU_SLOTS, GRID_COLUMN_MENU_SLOT_PROPS } from '@mui/x-data-grid';
import { GridColumnMenuPinningItem } from "./GridColumnMenuPinningItem.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const GRID_COLUMN_MENU_SLOTS_PRO = _extends({}, GRID_COLUMN_MENU_SLOTS, {
  columnMenuPinningItem: GridColumnMenuPinningItem
});
export const GRID_COLUMN_MENU_SLOT_PROPS_PRO = _extends({}, GRID_COLUMN_MENU_SLOT_PROPS, {
  columnMenuPinningItem: {
    displayOrder: 15
  }
});
export const GridProColumnMenu = /*#__PURE__*/React.forwardRef(function GridProColumnMenu(props, ref) {
  return /*#__PURE__*/_jsx(GridGenericColumnMenu, _extends({
    ref: ref
  }, props, {
    defaultSlots: GRID_COLUMN_MENU_SLOTS_PRO,
    defaultSlotProps: GRID_COLUMN_MENU_SLOT_PROPS_PRO
  }));
});
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { getDataGridUtilityClass, useGridSelector } from '@mui/x-data-grid';
import { useGridSelectorV8 } from '@mui/x-data-grid/internals';
import CircularProgress from '@mui/material/CircularProgress';
import { useGridRootProps } from "../hooks/utils/useGridRootProps.js";
import { useGridPrivateApiContext } from "../hooks/utils/useGridPrivateApiContext.js";
import { gridDataSourceErrorSelector, gridDataSourceLoadingIdSelector } from "../hooks/features/dataSource/gridDataSourceSelector.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle'],
    loadingContainer: ['treeDataGroupingCellLoadingContainer']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridTreeDataGroupingCellIcon(props) {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const {
    rowNode,
    id,
    field,
    descendantCount
  } = props;
  const isDataLoading = useGridSelectorV8(apiRef, gridDataSourceLoadingIdSelector, id);
  const error = useGridSelectorV8(apiRef, gridDataSourceErrorSelector, id);
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
    return /*#__PURE__*/_jsx("div", {
      className: classes.loadingContainer,
      children: /*#__PURE__*/_jsx(CircularProgress, {
        size: "1rem",
        color: "inherit"
      })
    });
  }
  return descendantCount > 0 ? /*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
    size: "small",
    onClick: handleClick,
    tabIndex: -1,
    "aria-label": rowNode.childrenExpanded ? apiRef.current.getLocaleText('treeDataCollapse') : apiRef.current.getLocaleText('treeDataExpand')
  }, rootProps?.slotProps?.baseIconButton, {
    children: /*#__PURE__*/_jsx(rootProps.slots.baseTooltip, {
      title: error?.message ?? null,
      children: /*#__PURE__*/_jsx(Badge, {
        variant: "dot",
        color: "error",
        invisible: !error,
        children: /*#__PURE__*/_jsx(Icon, {
          fontSize: "inherit"
        })
      })
    })
  })) : null;
}
export function GridDataSourceTreeDataGroupingCell(props) {
  const {
    id,
    field,
    formattedValue,
    rowNode,
    hideDescendantCount,
    offsetMultiplier = 2
  } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridPrivateApiContext();
  const rowSelector = state => state.rows.dataRowIdToModelLookup[id];
  const row = useGridSelector(apiRef, rowSelector);
  const classes = useUtilityClasses(rootProps);
  let descendantCount = 0;
  if (row) {
    descendantCount = Math.max(rootProps.unstable_dataSource?.getChildrenCount?.(row) ?? 0, 0);
  }
  return /*#__PURE__*/_jsxs(Box, {
    className: classes.root,
    sx: {
      ml: rowNode.depth * offsetMultiplier
    },
    children: [/*#__PURE__*/_jsx("div", {
      className: classes.toggle,
      children: /*#__PURE__*/_jsx(GridTreeDataGroupingCellIcon, {
        id: id,
        field: field,
        rowNode: rowNode,
        row: row,
        descendantCount: descendantCount
      })
    }), /*#__PURE__*/_jsxs("span", {
      children: [formattedValue === undefined ? rowNode.groupingKey : formattedValue, !hideDescendantCount && descendantCount > 0 ? ` (${descendantCount})` : '']
    })]
  });
}
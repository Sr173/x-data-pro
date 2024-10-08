import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { GRID_DEFAULT_LOCALE_TEXT, DATA_GRID_PROPS_DEFAULT_VALUES } from '@mui/x-data-grid';
import { computeSlots, useProps } from '@mui/x-data-grid/internals';
import { DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS } from "../constants/dataGridProDefaultSlotsComponents.js";
const getDataGridProForcedProps = themedProps => _extends({
  signature: 'DataGridPro'
}, themedProps.unstable_dataSource ? {
  filterMode: 'server',
  sortingMode: 'server',
  paginationMode: 'server'
} : {});

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
export const DATA_GRID_PRO_PROPS_DEFAULT_VALUES = _extends({}, DATA_GRID_PROPS_DEFAULT_VALUES, {
  autosizeOnMount: false,
  defaultGroupingExpansionDepth: 0,
  disableAutosize: false,
  disableChildrenFiltering: false,
  disableChildrenSorting: false,
  disableColumnPinning: false,
  getDetailPanelHeight: () => 500,
  headerFilters: false,
  keepColumnPositionIfDraggedOutside: false,
  rowReordering: false,
  rowsLoadingMode: 'client',
  scrollEndThreshold: 80,
  treeData: false
});
const defaultSlots = DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS;
export const useDataGridProProps = inProps => {
  const themedProps = useProps(
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  useThemeProps({
    props: inProps,
    name: 'MuiDataGrid'
  }));
  const localeText = React.useMemo(() => _extends({}, GRID_DEFAULT_LOCALE_TEXT, themedProps.localeText), [themedProps.localeText]);
  const slots = React.useMemo(() => computeSlots({
    defaultSlots,
    slots: themedProps.slots
  }), [themedProps.slots]);
  return React.useMemo(() => _extends({}, DATA_GRID_PRO_PROPS_DEFAULT_VALUES, themedProps, {
    localeText,
    slots
  }, getDataGridProForcedProps(themedProps)), [themedProps, localeText, slots]);
};
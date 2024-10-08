"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataGridProProps = exports.DATA_GRID_PRO_PROPS_DEFAULT_VALUES = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _styles = require("@mui/material/styles");
var _xDataGrid = require("@mui/x-data-grid");
var _internals = require("@mui/x-data-grid/internals");
var _dataGridProDefaultSlotsComponents = require("../constants/dataGridProDefaultSlotsComponents");
const getDataGridProForcedProps = themedProps => (0, _extends2.default)({
  signature: 'DataGridPro'
}, themedProps.unstable_dataSource ? {
  filterMode: 'server',
  sortingMode: 'server',
  paginationMode: 'server'
} : {});

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
const DATA_GRID_PRO_PROPS_DEFAULT_VALUES = exports.DATA_GRID_PRO_PROPS_DEFAULT_VALUES = (0, _extends2.default)({}, _xDataGrid.DATA_GRID_PROPS_DEFAULT_VALUES, {
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
const defaultSlots = _dataGridProDefaultSlotsComponents.DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS;
const useDataGridProProps = inProps => {
  const themedProps = (0, _internals.useProps)(
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiDataGrid'
  }));
  const localeText = React.useMemo(() => (0, _extends2.default)({}, _xDataGrid.GRID_DEFAULT_LOCALE_TEXT, themedProps.localeText), [themedProps.localeText]);
  const slots = React.useMemo(() => (0, _internals.computeSlots)({
    defaultSlots,
    slots: themedProps.slots
  }), [themedProps.slots]);
  return React.useMemo(() => (0, _extends2.default)({}, DATA_GRID_PRO_PROPS_DEFAULT_VALUES, themedProps, {
    localeText,
    slots
  }, getDataGridProForcedProps(themedProps)), [themedProps, localeText, slots]);
};
exports.useDataGridProProps = useDataGridProProps;
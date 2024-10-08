"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridRowReorderPreProcessors = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _xDataGrid = require("@mui/x-data-grid");
var _internals = require("@mui/x-data-grid/internals");
var _gridRowReorderColDef = require("./gridRowReorderColDef");
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  return React.useMemo(() => {
    const slots = {
      rowReorderCellContainer: ['rowReorderCellContainer'],
      columnHeaderReorder: ['columnHeaderReorder']
    };
    return (0, _composeClasses.default)(slots, _xDataGrid.getDataGridUtilityClass, classes);
  }, [classes]);
};
const useGridRowReorderPreProcessors = (privateApiRef, props) => {
  const ownerState = {
    classes: props.classes
  };
  const classes = useUtilityClasses(ownerState);
  const updateReorderColumn = React.useCallback(columnsState => {
    const reorderColumn = (0, _extends2.default)({}, _gridRowReorderColDef.GRID_REORDER_COL_DEF, {
      cellClassName: classes.rowReorderCellContainer,
      headerClassName: classes.columnHeaderReorder,
      headerName: privateApiRef.current.getLocaleText('rowReorderingHeaderName')
    });
    const shouldHaveReorderColumn = props.rowReordering;
    const haveReorderColumn = columnsState.lookup[reorderColumn.field] != null;
    if (shouldHaveReorderColumn && haveReorderColumn) {
      return columnsState;
    }
    if (shouldHaveReorderColumn && !haveReorderColumn) {
      columnsState.lookup[reorderColumn.field] = reorderColumn;
      columnsState.orderedFields = [reorderColumn.field, ...columnsState.orderedFields];
    } else if (!shouldHaveReorderColumn && haveReorderColumn) {
      delete columnsState.lookup[reorderColumn.field];
      columnsState.orderedFields = columnsState.orderedFields.filter(field => field !== reorderColumn.field);
    }
    return columnsState;
  }, [privateApiRef, classes, props.rowReordering]);
  (0, _internals.useGridRegisterPipeProcessor)(privateApiRef, 'hydrateColumns', updateReorderColumn);
};
exports.useGridRowReorderPreProcessors = useGridRowReorderPreProcessors;
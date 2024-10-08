"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridTreeData = void 0;
var React = _interopRequireWildcard(require("react"));
var _xDataGrid = require("@mui/x-data-grid");
var _gridTreeDataGroupColDef = require("./gridTreeDataGroupColDef");
const useGridTreeData = (apiRef, props) => {
  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback((params, event) => {
    const cellParams = apiRef.current.getCellParams(params.id, params.field);
    if (cellParams.colDef.field === _gridTreeDataGroupColDef.GRID_TREE_DATA_GROUPING_FIELD && event.key === ' ' && !event.shiftKey) {
      if (params.rowNode.type !== 'group') {
        return;
      }
      if (props.unstable_dataSource && !params.rowNode.childrenExpanded) {
        apiRef.current.unstable_dataSource.fetchRows(params.id);
        return;
      }
      apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
    }
  }, [apiRef, props.unstable_dataSource]);
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, 'cellKeyDown', handleCellKeyDown);
};
exports.useGridTreeData = useGridTreeData;
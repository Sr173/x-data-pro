"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridGetRowsParamsSelector = exports.gridDataSourceStateSelector = exports.gridDataSourceLoadingSelector = exports.gridDataSourceLoadingIdSelector = exports.gridDataSourceErrorsSelector = exports.gridDataSourceErrorSelector = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _xDataGrid = require("@mui/x-data-grid");
var _internals = require("@mui/x-data-grid/internals");
const computeStartEnd = paginationModel => {
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize - 1;
  return {
    start,
    end
  };
};
const gridGetRowsParamsSelector = exports.gridGetRowsParamsSelector = (0, _internals.createSelector)(_xDataGrid.gridFilterModelSelector, _xDataGrid.gridSortModelSelector, _xDataGrid.gridPaginationModelSelector, (filterModel, sortModel, paginationModel) => {
  return (0, _extends2.default)({
    groupKeys: [],
    // TODO: Implement with `rowGrouping`
    groupFields: [],
    paginationModel,
    sortModel,
    filterModel
  }, computeStartEnd(paginationModel));
});
const gridDataSourceStateSelector = state => state.dataSource;
exports.gridDataSourceStateSelector = gridDataSourceStateSelector;
const gridDataSourceLoadingSelector = exports.gridDataSourceLoadingSelector = (0, _internals.createSelector)(gridDataSourceStateSelector, dataSource => dataSource.loading);
const gridDataSourceLoadingIdSelector = exports.gridDataSourceLoadingIdSelector = (0, _internals.createSelectorV8)(gridDataSourceStateSelector, (dataSource, id) => dataSource.loading[id] ?? false);
const gridDataSourceErrorsSelector = exports.gridDataSourceErrorsSelector = (0, _internals.createSelector)(gridDataSourceStateSelector, dataSource => dataSource.errors);
const gridDataSourceErrorSelector = exports.gridDataSourceErrorSelector = (0, _internals.createSelectorV8)(gridDataSourceStateSelector, (dataSource, id) => dataSource.errors[id]);
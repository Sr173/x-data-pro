import _extends from "@babel/runtime/helpers/esm/extends";
import { gridFilterModelSelector, gridSortModelSelector, gridPaginationModelSelector } from '@mui/x-data-grid';
import { createSelector, createSelectorV8 } from '@mui/x-data-grid/internals';
const computeStartEnd = paginationModel => {
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize - 1;
  return {
    start,
    end
  };
};
export const gridGetRowsParamsSelector = createSelector(gridFilterModelSelector, gridSortModelSelector, gridPaginationModelSelector, (filterModel, sortModel, paginationModel) => {
  return _extends({
    groupKeys: [],
    // TODO: Implement with `rowGrouping`
    groupFields: [],
    paginationModel,
    sortModel,
    filterModel
  }, computeStartEnd(paginationModel));
});
export const gridDataSourceStateSelector = state => state.dataSource;
export const gridDataSourceLoadingSelector = createSelector(gridDataSourceStateSelector, dataSource => dataSource.loading);
export const gridDataSourceLoadingIdSelector = createSelectorV8(gridDataSourceStateSelector, (dataSource, id) => dataSource.loading[id] ?? false);
export const gridDataSourceErrorsSelector = createSelector(gridDataSourceStateSelector, dataSource => dataSource.errors);
export const gridDataSourceErrorSelector = createSelectorV8(gridDataSourceStateSelector, (dataSource, id) => dataSource.errors[id]);
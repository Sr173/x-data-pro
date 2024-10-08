import { GridPaginationModel, GridRowId } from '@mui/x-data-grid';
import { GridStatePro } from '../../../models/gridStatePro';
export declare const gridGetRowsParamsSelector: import("@mui/x-data-grid").OutputSelector<import("@mui/x-data-grid/models/gridStateCommunity").GridStateCommunity, {
    start: number;
    end: number;
    groupKeys: never[];
    groupFields: never[];
    paginationModel: GridPaginationModel;
    sortModel: import("@mui/x-data-grid").GridSortModel;
    filterModel: import("@mui/x-data-grid").GridFilterModel;
}>;
export declare const gridDataSourceStateSelector: (state: GridStatePro) => import("./interfaces").GridDataSourceState;
export declare const gridDataSourceLoadingSelector: import("@mui/x-data-grid").OutputSelector<GridStatePro, Record<GridRowId, boolean>>;
export declare const gridDataSourceLoadingIdSelector: import("@mui/x-data-grid/utils/createSelector").OutputSelectorV8<GridStatePro, GridRowId, boolean>;
export declare const gridDataSourceErrorsSelector: import("@mui/x-data-grid").OutputSelector<GridStatePro, Record<GridRowId, any>>;
export declare const gridDataSourceErrorSelector: import("@mui/x-data-grid/utils/createSelector").OutputSelectorV8<GridStatePro, GridRowId, any>;

"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridDataSource = exports.dataSourceStateInitializer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useLazyRef = _interopRequireDefault(require("@mui/utils/useLazyRef"));
var _xDataGrid = require("@mui/x-data-grid");
var _internals = require("@mui/x-data-grid/internals");
var _gridDataSourceSelector = require("./gridDataSourceSelector");
var _utils = require("./utils");
var _cache = require("./cache");
const INITIAL_STATE = {
  loading: {},
  errors: {}
};
const noopCache = {
  clear: () => {},
  get: () => undefined,
  set: () => {}
};
function getCache(cacheProp) {
  if (cacheProp === null) {
    return noopCache;
  }
  return cacheProp ?? new _cache.GridDataSourceCacheDefault({});
}
const dataSourceStateInitializer = state => {
  return (0, _extends2.default)({}, state, {
    dataSource: INITIAL_STATE
  });
};
exports.dataSourceStateInitializer = dataSourceStateInitializer;
const useGridDataSource = (apiRef, props) => {
  const nestedDataManager = (0, _useLazyRef.default)(() => new _utils.NestedDataManager(apiRef)).current;
  const groupsToAutoFetch = (0, _xDataGrid.useGridSelector)(apiRef, _internals.gridRowGroupsToFetchSelector);
  const scheduledGroups = React.useRef(0);
  const onError = props.unstable_onDataSourceError;
  const [cache, setCache] = React.useState(() => getCache(props.unstable_dataSourceCache));
  const fetchRows = React.useCallback(async parentId => {
    const getRows = props.unstable_dataSource?.getRows;
    if (!getRows) {
      return;
    }
    if (parentId) {
      nestedDataManager.queue([parentId]);
      return;
    }
    nestedDataManager.clear();
    scheduledGroups.current = 0;
    const dataSourceState = apiRef.current.state.dataSource;
    if (dataSourceState !== INITIAL_STATE) {
      apiRef.current.resetDataSourceState();
    }
    const fetchParams = (0, _gridDataSourceSelector.gridGetRowsParamsSelector)(apiRef);
    const cachedData = apiRef.current.unstable_dataSource.cache.get(fetchParams);
    if (cachedData !== undefined) {
      const rows = cachedData.rows;
      apiRef.current.setRows(rows);
      if (cachedData.rowCount) {
        apiRef.current.setRowCount(cachedData.rowCount);
      }
      return;
    }
    const isLoading = (0, _xDataGrid.gridRowsLoadingSelector)(apiRef);
    if (!isLoading) {
      apiRef.current.setLoading(true);
    }
    try {
      const getRowsResponse = await getRows(fetchParams);
      apiRef.current.unstable_dataSource.cache.set(fetchParams, getRowsResponse);
      if (getRowsResponse.rowCount) {
        apiRef.current.setRowCount(getRowsResponse.rowCount);
      }
      apiRef.current.setRows(getRowsResponse.rows);
      apiRef.current.setLoading(false);
    } catch (error) {
      apiRef.current.setRows([]);
      apiRef.current.setLoading(false);
      onError?.(error, fetchParams);
    }
  }, [nestedDataManager, apiRef, props.unstable_dataSource?.getRows, onError]);
  const fetchRowChildren = React.useCallback(async id => {
    if (!props.treeData) {
      nestedDataManager.clearPendingRequest(id);
      return;
    }
    const getRows = props.unstable_dataSource?.getRows;
    if (!getRows) {
      nestedDataManager.clearPendingRequest(id);
      return;
    }
    const rowNode = apiRef.current.getRowNode(id);
    if (!rowNode) {
      nestedDataManager.clearPendingRequest(id);
      return;
    }
    const fetchParams = (0, _extends2.default)({}, (0, _gridDataSourceSelector.gridGetRowsParamsSelector)(apiRef), {
      groupKeys: rowNode.path
    });
    const cachedData = apiRef.current.unstable_dataSource.cache.get(fetchParams);
    if (cachedData !== undefined) {
      const rows = cachedData.rows;
      nestedDataManager.setRequestSettled(id);
      apiRef.current.updateServerRows(rows, rowNode.path);
      if (cachedData.rowCount) {
        apiRef.current.setRowCount(cachedData.rowCount);
      }
      apiRef.current.setRowChildrenExpansion(id, true);
      apiRef.current.unstable_dataSource.setChildrenLoading(id, false);
      return;
    }
    const existingError = (0, _gridDataSourceSelector.gridDataSourceErrorsSelector)(apiRef)[id] ?? null;
    if (existingError) {
      apiRef.current.unstable_dataSource.setChildrenFetchError(id, null);
    }
    try {
      const getRowsResponse = await getRows(fetchParams);
      if (!apiRef.current.getRowNode(id)) {
        // The row has been removed from the grid
        nestedDataManager.clearPendingRequest(id);
        return;
      }
      if (nestedDataManager.getRequestStatus(id) === _utils.RequestStatus.UNKNOWN) {
        apiRef.current.unstable_dataSource.setChildrenLoading(id, false);
        return;
      }
      nestedDataManager.setRequestSettled(id);
      apiRef.current.unstable_dataSource.cache.set(fetchParams, getRowsResponse);
      if (getRowsResponse.rowCount) {
        apiRef.current.setRowCount(getRowsResponse.rowCount);
      }
      apiRef.current.updateServerRows(getRowsResponse.rows, rowNode.path);
      apiRef.current.setRowChildrenExpansion(id, true);
    } catch (error) {
      const e = error;
      apiRef.current.unstable_dataSource.setChildrenFetchError(id, e);
      onError?.(e, fetchParams);
    } finally {
      apiRef.current.unstable_dataSource.setChildrenLoading(id, false);
      nestedDataManager.setRequestSettled(id);
    }
  }, [nestedDataManager, onError, apiRef, props.treeData, props.unstable_dataSource?.getRows]);
  const setChildrenLoading = React.useCallback((parentId, isLoading) => {
    apiRef.current.setState(state => {
      if (!state.dataSource.loading[parentId] && isLoading === false) {
        return state;
      }
      const newLoadingState = (0, _extends2.default)({}, state.dataSource.loading);
      if (isLoading === false) {
        delete newLoadingState[parentId];
      } else {
        newLoadingState[parentId] = isLoading;
      }
      return (0, _extends2.default)({}, state, {
        dataSource: (0, _extends2.default)({}, state.dataSource, {
          loading: newLoadingState
        })
      });
    });
  }, [apiRef]);
  const setChildrenFetchError = React.useCallback((parentId, error) => {
    apiRef.current.setState(state => {
      const newErrorsState = (0, _extends2.default)({}, state.dataSource.errors);
      if (error === null && newErrorsState[parentId] !== undefined) {
        delete newErrorsState[parentId];
      } else {
        newErrorsState[parentId] = error;
      }
      return (0, _extends2.default)({}, state, {
        dataSource: (0, _extends2.default)({}, state.dataSource, {
          errors: newErrorsState
        })
      });
    });
  }, [apiRef]);
  const resetDataSourceState = React.useCallback(() => {
    apiRef.current.setState(state => {
      return (0, _extends2.default)({}, state, {
        dataSource: INITIAL_STATE
      });
    });
  }, [apiRef]);
  const dataSourceApi = {
    unstable_dataSource: {
      setChildrenLoading,
      setChildrenFetchError,
      fetchRows,
      cache
    }
  };
  const dataSourcePrivateApi = {
    fetchRowChildren,
    resetDataSourceState
  };
  (0, _xDataGrid.useGridApiMethod)(apiRef, dataSourceApi, 'public');
  (0, _xDataGrid.useGridApiMethod)(apiRef, dataSourcePrivateApi, 'private');
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, 'sortModelChange', (0, _utils.runIfServerMode)(props.sortingMode, fetchRows));
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, 'filterModelChange', (0, _utils.runIfServerMode)(props.filterMode, fetchRows));
  (0, _xDataGrid.useGridApiEventHandler)(apiRef, 'paginationModelChange', (0, _utils.runIfServerMode)(props.paginationMode, fetchRows));
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const newCache = getCache(props.unstable_dataSourceCache);
    setCache(prevCache => prevCache !== newCache ? newCache : prevCache);
  }, [props.unstable_dataSourceCache]);
  React.useEffect(() => {
    if (props.unstable_dataSource) {
      apiRef.current.unstable_dataSource.cache.clear();
      apiRef.current.unstable_dataSource.fetchRows();
    }
  }, [apiRef, props.unstable_dataSource]);
  React.useEffect(() => {
    if (groupsToAutoFetch && groupsToAutoFetch.length && scheduledGroups.current < groupsToAutoFetch.length) {
      const groupsToSchedule = groupsToAutoFetch.slice(scheduledGroups.current);
      nestedDataManager.queue(groupsToSchedule);
      scheduledGroups.current = groupsToAutoFetch.length;
    }
  }, [apiRef, nestedDataManager, groupsToAutoFetch]);
};
exports.useGridDataSource = useGridDataSource;
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { useGridApiEventHandler, gridRowsLoadingSelector, useGridApiMethod, useGridSelector } from '@mui/x-data-grid';
import { gridRowGroupsToFetchSelector } from '@mui/x-data-grid/internals';
import { gridGetRowsParamsSelector, gridDataSourceErrorsSelector } from "./gridDataSourceSelector.js";
import { runIfServerMode, NestedDataManager, RequestStatus } from "./utils.js";
import { GridDataSourceCacheDefault } from "./cache.js";
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
  return cacheProp ?? new GridDataSourceCacheDefault({});
}
export const dataSourceStateInitializer = state => {
  return _extends({}, state, {
    dataSource: INITIAL_STATE
  });
};
export const useGridDataSource = (apiRef, props) => {
  const nestedDataManager = useLazyRef(() => new NestedDataManager(apiRef)).current;
  const groupsToAutoFetch = useGridSelector(apiRef, gridRowGroupsToFetchSelector);
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
    const fetchParams = gridGetRowsParamsSelector(apiRef);
    const cachedData = apiRef.current.unstable_dataSource.cache.get(fetchParams);
    if (cachedData !== undefined) {
      const rows = cachedData.rows;
      apiRef.current.setRows(rows);
      if (cachedData.rowCount) {
        apiRef.current.setRowCount(cachedData.rowCount);
      }
      return;
    }
    const isLoading = gridRowsLoadingSelector(apiRef);
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
    const fetchParams = _extends({}, gridGetRowsParamsSelector(apiRef), {
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
    const existingError = gridDataSourceErrorsSelector(apiRef)[id] ?? null;
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
      if (nestedDataManager.getRequestStatus(id) === RequestStatus.UNKNOWN) {
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
      const newLoadingState = _extends({}, state.dataSource.loading);
      if (isLoading === false) {
        delete newLoadingState[parentId];
      } else {
        newLoadingState[parentId] = isLoading;
      }
      return _extends({}, state, {
        dataSource: _extends({}, state.dataSource, {
          loading: newLoadingState
        })
      });
    });
  }, [apiRef]);
  const setChildrenFetchError = React.useCallback((parentId, error) => {
    apiRef.current.setState(state => {
      const newErrorsState = _extends({}, state.dataSource.errors);
      if (error === null && newErrorsState[parentId] !== undefined) {
        delete newErrorsState[parentId];
      } else {
        newErrorsState[parentId] = error;
      }
      return _extends({}, state, {
        dataSource: _extends({}, state.dataSource, {
          errors: newErrorsState
        })
      });
    });
  }, [apiRef]);
  const resetDataSourceState = React.useCallback(() => {
    apiRef.current.setState(state => {
      return _extends({}, state, {
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
  useGridApiMethod(apiRef, dataSourceApi, 'public');
  useGridApiMethod(apiRef, dataSourcePrivateApi, 'private');
  useGridApiEventHandler(apiRef, 'sortModelChange', runIfServerMode(props.sortingMode, fetchRows));
  useGridApiEventHandler(apiRef, 'filterModelChange', runIfServerMode(props.filterMode, fetchRows));
  useGridApiEventHandler(apiRef, 'paginationModelChange', runIfServerMode(props.paginationMode, fetchRows));
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
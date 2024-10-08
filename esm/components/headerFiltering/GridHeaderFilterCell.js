import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["colIndex", "height", "hasFocus", "width", "headerClassName", "colDef", "item", "headerFilterMenuRef", "InputComponentProps", "showClearIcon", "pinnedPosition", "style", "indexInSection", "sectionLength", "gridHasFiller"];
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_useForkRef as useForkRef, unstable_composeClasses as composeClasses, unstable_capitalize as capitalize } from '@mui/utils';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { gridVisibleColumnFieldsSelector, getDataGridUtilityClass, useGridSelector, GridFilterInputValue, GridFilterInputDate, GridFilterInputBoolean, GridFilterInputSingleSelect, gridFilterModelSelector, gridFilterableColumnLookupSelector } from '@mui/x-data-grid';
import { useGridPrivateApiContext, gridHeaderFilteringEditFieldSelector, gridHeaderFilteringMenuSelector, isNavigationKey, shouldCellShowLeftBorder, shouldCellShowRightBorder } from '@mui/x-data-grid/internals';
import { useGridRootProps } from "../../hooks/utils/useGridRootProps.js";
import { GridHeaderFilterMenuContainer } from "./GridHeaderFilterMenuContainer.js";
import { GridHeaderFilterClearButton } from "./GridHeaderFilterClearButton.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    colDef,
    classes,
    showRightBorder,
    showLeftBorder,
    pinnedPosition
  } = ownerState;
  const slots = {
    root: ['columnHeader', colDef.headerAlign === 'left' && 'columnHeader--alignLeft', colDef.headerAlign === 'center' && 'columnHeader--alignCenter', colDef.headerAlign === 'right' && 'columnHeader--alignRight', 'withBorderColor', showRightBorder && 'columnHeader--withRightBorder', showLeftBorder && 'columnHeader--withLeftBorder', pinnedPosition === 'left' && 'columnHeader--pinnedLeft', pinnedPosition === 'right' && 'columnHeader--pinnedRight']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
const dateSx = {
  [`& input[value=""]:not(:focus)`]: {
    color: 'transparent'
  }
};
const defaultInputComponents = {
  string: GridFilterInputValue,
  number: GridFilterInputValue,
  date: GridFilterInputDate,
  dateTime: GridFilterInputDate,
  boolean: GridFilterInputBoolean,
  singleSelect: GridFilterInputSingleSelect,
  actions: null,
  custom: null
};
const GridHeaderFilterCell = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
      colIndex,
      height,
      hasFocus,
      width,
      headerClassName,
      colDef,
      item,
      headerFilterMenuRef,
      InputComponentProps,
      showClearIcon = true,
      pinnedPosition,
      style: styleProp,
      indexInSection,
      sectionLength,
      gridHasFiller
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const apiRef = useGridPrivateApiContext();
  const columnFields = useGridSelector(apiRef, gridVisibleColumnFieldsSelector);
  const rootProps = useGridRootProps();
  const cellRef = React.useRef(null);
  const handleRef = useForkRef(ref, cellRef);
  const inputRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const editingField = useGridSelector(apiRef, gridHeaderFilteringEditFieldSelector);
  const isEditing = editingField === colDef.field;
  const menuOpenField = useGridSelector(apiRef, gridHeaderFilteringMenuSelector);
  const isMenuOpen = menuOpenField === colDef.field;

  // TODO: Support for `isAnyOf` operator
  const filterOperators = React.useMemo(() => {
    if (!colDef.filterOperators) {
      return [];
    }
    return colDef.filterOperators.filter(operator => operator.value !== 'isAnyOf');
  }, [colDef.filterOperators]);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const filterableColumnsLookup = useGridSelector(apiRef, gridFilterableColumnLookupSelector);
  const isFilterReadOnly = React.useMemo(() => {
    if (!filterModel?.items.length) {
      return false;
    }
    const filterModelItem = filterModel.items.find(it => it.field === colDef.field);
    return filterModelItem ? !filterableColumnsLookup[filterModelItem.field] : false;
  }, [colDef.field, filterModel, filterableColumnsLookup]);
  const currentOperator = React.useMemo(() => filterOperators.find(operator => operator.value === item.operator) ?? filterOperators[0], [item.operator, filterOperators]);
  const InputComponent = colDef.filterable || isFilterReadOnly ? currentOperator.InputComponent ?? defaultInputComponents[colDef.type] : null;
  const applyFilterChanges = React.useCallback(updatedItem => {
    if (item.value && !updatedItem.value) {
      apiRef.current.deleteFilterItem(updatedItem);
      return;
    }
    apiRef.current.upsertFilterItem(updatedItem);
  }, [apiRef, item]);
  const clearFilterItem = React.useCallback(() => {
    apiRef.current.deleteFilterItem(item);
  }, [apiRef, item]);
  let headerFilterComponent;
  if (colDef.renderHeaderFilter) {
    headerFilterComponent = colDef.renderHeaderFilter(_extends({}, props, {
      inputRef
    }));
  }
  React.useLayoutEffect(() => {
    if (hasFocus && !isMenuOpen) {
      let focusableElement = cellRef.current.querySelector('[tabindex="0"]');
      if (isEditing && InputComponent) {
        focusableElement = inputRef.current;
      }
      const elementToFocus = focusableElement || cellRef.current;
      elementToFocus?.focus();
      apiRef.current.columnHeadersContainerRef.current.scrollLeft = 0;
    }
  }, [InputComponent, apiRef, hasFocus, isEditing, isMenuOpen]);
  const onKeyDown = React.useCallback(event => {
    if (isMenuOpen || isNavigationKey(event.key) || isFilterReadOnly) {
      return;
    }
    switch (event.key) {
      case 'Escape':
        if (isEditing) {
          apiRef.current.stopHeaderFilterEditMode();
        }
        break;
      case 'Enter':
        if (isEditing) {
          if (!event.defaultPrevented) {
            apiRef.current.stopHeaderFilterEditMode();
            break;
          }
        }
        if (event.metaKey || event.ctrlKey) {
          headerFilterMenuRef.current = buttonRef.current;
          apiRef.current.showHeaderFilterMenu(colDef.field);
          break;
        }
        apiRef.current.startHeaderFilterEditMode(colDef.field);
        break;
      case 'Tab':
        {
          if (isEditing) {
            const fieldToFocus = columnFields[colIndex + (event.shiftKey ? -1 : 1)] ?? null;
            if (fieldToFocus) {
              apiRef.current.startHeaderFilterEditMode(fieldToFocus);
              apiRef.current.setColumnHeaderFilterFocus(fieldToFocus, event);
            }
          }
          break;
        }
      default:
        if (isEditing || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
          break;
        }
        apiRef.current.startHeaderFilterEditMode(colDef.field);
        break;
    }
  }, [apiRef, colDef.field, colIndex, columnFields, headerFilterMenuRef, isEditing, isFilterReadOnly, isMenuOpen]);
  const publish = React.useCallback((eventName, propHandler) => event => {
    apiRef.current.publishEvent(eventName, apiRef.current.getColumnHeaderParams(colDef.field), event);
    if (propHandler) {
      propHandler(event);
    }
  }, [apiRef, colDef.field]);
  const onMouseDown = React.useCallback(event => {
    if (!hasFocus) {
      if (inputRef.current?.contains?.(event.target)) {
        inputRef.current.focus();
      }
      apiRef.current.setColumnHeaderFilterFocus(colDef.field, event);
    }
  }, [apiRef, colDef.field, hasFocus]);
  const mouseEventsHandlers = React.useMemo(() => ({
    onKeyDown: publish('headerFilterKeyDown', onKeyDown),
    onClick: publish('headerFilterClick'),
    onMouseDown: publish('headerFilterMouseDown', onMouseDown),
    onBlur: publish('headerFilterBlur')
  }), [onMouseDown, onKeyDown, publish]);
  const showLeftBorder = shouldCellShowLeftBorder(pinnedPosition, indexInSection);
  const showRightBorder = shouldCellShowRightBorder(pinnedPosition, indexInSection, sectionLength, rootProps.showCellVerticalBorder, gridHasFiller);
  const ownerState = _extends({}, rootProps, {
    pinnedPosition,
    colDef,
    showLeftBorder,
    showRightBorder
  });
  const classes = useUtilityClasses(ownerState);
  const isNoInputOperator = currentOperator.requiresFilterValue === false;
  const isApplied = Boolean(item?.value) || isNoInputOperator;
  const label = currentOperator.headerLabel ?? apiRef.current.getLocaleText(`headerFilterOperator${capitalize(item.operator)}`);
  const isFilterActive = isApplied || hasFocus;
  return /*#__PURE__*/_jsxs("div", _extends({
    className: clsx(classes.root, headerClassName),
    ref: handleRef,
    style: _extends({
      height,
      width
    }, styleProp),
    role: "columnheader",
    "aria-colindex": colIndex + 1,
    "aria-label": headerFilterComponent == null ? colDef.headerName ?? colDef.field : undefined
  }, other, mouseEventsHandlers, {
    children: [headerFilterComponent, InputComponent && headerFilterComponent === undefined ? /*#__PURE__*/_jsxs(React.Fragment, {
      children: [/*#__PURE__*/_jsx(InputComponent, _extends({
        apiRef: apiRef,
        item: item,
        inputRef: inputRef,
        applyValue: applyFilterChanges,
        onFocus: () => apiRef.current.startHeaderFilterEditMode(colDef.field),
        onBlur: event => {
          apiRef.current.stopHeaderFilterEditMode();
          // Blurring an input element should reset focus state only if `relatedTarget` is not the header filter cell
          if (!event.relatedTarget?.className.includes('columnHeader')) {
            apiRef.current.setState(state => _extends({}, state, {
              focus: {
                cell: null,
                columnHeader: null,
                columnHeaderFilter: null,
                columnGroupHeader: null
              }
            }));
          }
        },
        label: capitalize(label),
        placeholder: "",
        isFilterActive: isFilterActive,
        clearButton: showClearIcon && isApplied ? /*#__PURE__*/_jsx(GridHeaderFilterClearButton, {
          onClick: clearFilterItem,
          disabled: isFilterReadOnly
        }) : null,
        disabled: isFilterReadOnly || isNoInputOperator,
        tabIndex: -1,
        InputLabelProps: null,
        sx: colDef.type === 'date' || colDef.type === 'dateTime' ? dateSx : undefined
      }, isNoInputOperator ? {
        value: ''
      } : {}, currentOperator?.InputComponentProps, InputComponentProps)), /*#__PURE__*/_jsx(GridHeaderFilterMenuContainer, {
        operators: filterOperators,
        item: item,
        field: colDef.field,
        disabled: isFilterReadOnly,
        applyFilterChanges: applyFilterChanges,
        headerFilterMenuRef: headerFilterMenuRef,
        buttonRef: buttonRef
      })]
    }) : null]
  }));
});
process.env.NODE_ENV !== "production" ? GridHeaderFilterCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  colIndex: PropTypes.number.isRequired,
  gridHasFiller: PropTypes.bool.isRequired,
  hasFocus: PropTypes.bool,
  /**
   * Class name that will be added in the column header cell.
   */
  headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  headerFilterMenuRef: PropTypes.shape({
    current: PropTypes.object
  }).isRequired,
  height: PropTypes.number.isRequired,
  indexInSection: PropTypes.number.isRequired,
  InputComponentProps: PropTypes.object,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any
  }).isRequired,
  pinnedPosition: PropTypes.oneOf(['left', 'right']),
  sectionLength: PropTypes.number.isRequired,
  showClearIcon: PropTypes.bool,
  sortIndex: PropTypes.number,
  style: PropTypes.object,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  width: PropTypes.number.isRequired
} : void 0;
const Memoized = fastMemo(GridHeaderFilterCell);
export { Memoized as GridHeaderFilterCell };
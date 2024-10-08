"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridHeaderFilterCell = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _utils = require("@mui/utils");
var _fastMemo = require("@mui/x-internals/fastMemo");
var _xDataGrid = require("@mui/x-data-grid");
var _internals = require("@mui/x-data-grid/internals");
var _useGridRootProps = require("../../hooks/utils/useGridRootProps");
var _GridHeaderFilterMenuContainer = require("./GridHeaderFilterMenuContainer");
var _GridHeaderFilterClearButton = require("./GridHeaderFilterClearButton");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["colIndex", "height", "hasFocus", "width", "headerClassName", "colDef", "item", "headerFilterMenuRef", "InputComponentProps", "showClearIcon", "pinnedPosition", "style", "indexInSection", "sectionLength", "gridHasFiller"];
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
  return (0, _utils.unstable_composeClasses)(slots, _xDataGrid.getDataGridUtilityClass, classes);
};
const dateSx = {
  [`& input[value=""]:not(:focus)`]: {
    color: 'transparent'
  }
};
const defaultInputComponents = {
  string: _xDataGrid.GridFilterInputValue,
  number: _xDataGrid.GridFilterInputValue,
  date: _xDataGrid.GridFilterInputDate,
  dateTime: _xDataGrid.GridFilterInputDate,
  boolean: _xDataGrid.GridFilterInputBoolean,
  singleSelect: _xDataGrid.GridFilterInputSingleSelect,
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
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _internals.useGridPrivateApiContext)();
  const columnFields = (0, _xDataGrid.useGridSelector)(apiRef, _xDataGrid.gridVisibleColumnFieldsSelector);
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const cellRef = React.useRef(null);
  const handleRef = (0, _utils.unstable_useForkRef)(ref, cellRef);
  const inputRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const editingField = (0, _xDataGrid.useGridSelector)(apiRef, _internals.gridHeaderFilteringEditFieldSelector);
  const isEditing = editingField === colDef.field;
  const menuOpenField = (0, _xDataGrid.useGridSelector)(apiRef, _internals.gridHeaderFilteringMenuSelector);
  const isMenuOpen = menuOpenField === colDef.field;

  // TODO: Support for `isAnyOf` operator
  const filterOperators = React.useMemo(() => {
    if (!colDef.filterOperators) {
      return [];
    }
    return colDef.filterOperators.filter(operator => operator.value !== 'isAnyOf');
  }, [colDef.filterOperators]);
  const filterModel = (0, _xDataGrid.useGridSelector)(apiRef, _xDataGrid.gridFilterModelSelector);
  const filterableColumnsLookup = (0, _xDataGrid.useGridSelector)(apiRef, _xDataGrid.gridFilterableColumnLookupSelector);
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
    headerFilterComponent = colDef.renderHeaderFilter((0, _extends2.default)({}, props, {
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
    if (isMenuOpen || (0, _internals.isNavigationKey)(event.key) || isFilterReadOnly) {
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
  const showLeftBorder = (0, _internals.shouldCellShowLeftBorder)(pinnedPosition, indexInSection);
  const showRightBorder = (0, _internals.shouldCellShowRightBorder)(pinnedPosition, indexInSection, sectionLength, rootProps.showCellVerticalBorder, gridHasFiller);
  const ownerState = (0, _extends2.default)({}, rootProps, {
    pinnedPosition,
    colDef,
    showLeftBorder,
    showRightBorder
  });
  const classes = useUtilityClasses(ownerState);
  const isNoInputOperator = currentOperator.requiresFilterValue === false;
  const isApplied = Boolean(item?.value) || isNoInputOperator;
  const label = currentOperator.headerLabel ?? apiRef.current.getLocaleText(`headerFilterOperator${(0, _utils.unstable_capitalize)(item.operator)}`);
  const isFilterActive = isApplied || hasFocus;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", (0, _extends2.default)({
    className: (0, _clsx.default)(classes.root, headerClassName),
    ref: handleRef,
    style: (0, _extends2.default)({
      height,
      width
    }, styleProp),
    role: "columnheader",
    "aria-colindex": colIndex + 1,
    "aria-label": headerFilterComponent == null ? colDef.headerName ?? colDef.field : undefined
  }, other, mouseEventsHandlers, {
    children: [headerFilterComponent, InputComponent && headerFilterComponent === undefined ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(InputComponent, (0, _extends2.default)({
        apiRef: apiRef,
        item: item,
        inputRef: inputRef,
        applyValue: applyFilterChanges,
        onFocus: () => apiRef.current.startHeaderFilterEditMode(colDef.field),
        onBlur: event => {
          apiRef.current.stopHeaderFilterEditMode();
          // Blurring an input element should reset focus state only if `relatedTarget` is not the header filter cell
          if (!event.relatedTarget?.className.includes('columnHeader')) {
            apiRef.current.setState(state => (0, _extends2.default)({}, state, {
              focus: {
                cell: null,
                columnHeader: null,
                columnHeaderFilter: null,
                columnGroupHeader: null
              }
            }));
          }
        },
        label: (0, _utils.unstable_capitalize)(label),
        placeholder: "",
        isFilterActive: isFilterActive,
        clearButton: showClearIcon && isApplied ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridHeaderFilterClearButton.GridHeaderFilterClearButton, {
          onClick: clearFilterItem,
          disabled: isFilterReadOnly
        }) : null,
        disabled: isFilterReadOnly || isNoInputOperator,
        tabIndex: -1,
        InputLabelProps: null,
        sx: colDef.type === 'date' || colDef.type === 'dateTime' ? dateSx : undefined
      }, isNoInputOperator ? {
        value: ''
      } : {}, currentOperator?.InputComponentProps, InputComponentProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridHeaderFilterMenuContainer.GridHeaderFilterMenuContainer, {
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
  colDef: _propTypes.default.object.isRequired,
  colIndex: _propTypes.default.number.isRequired,
  gridHasFiller: _propTypes.default.bool.isRequired,
  hasFocus: _propTypes.default.bool,
  /**
   * Class name that will be added in the column header cell.
   */
  headerClassName: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string]),
  headerFilterMenuRef: _propTypes.default.shape({
    current: _propTypes.default.object
  }).isRequired,
  height: _propTypes.default.number.isRequired,
  indexInSection: _propTypes.default.number.isRequired,
  InputComponentProps: _propTypes.default.object,
  item: _propTypes.default.shape({
    field: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    operator: _propTypes.default.string.isRequired,
    value: _propTypes.default.any
  }).isRequired,
  pinnedPosition: _propTypes.default.oneOf(['left', 'right']),
  sectionLength: _propTypes.default.number.isRequired,
  showClearIcon: _propTypes.default.bool,
  sortIndex: _propTypes.default.number,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired,
  width: _propTypes.default.number.isRequired
} : void 0;
const Memoized = exports.GridHeaderFilterCell = (0, _fastMemo.fastMemo)(GridHeaderFilterCell);
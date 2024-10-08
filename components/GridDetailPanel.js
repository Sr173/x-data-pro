"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridDetailPanel = GridDetailPanel;
var React = _interopRequireWildcard(require("react"));
var _styles = require("@mui/material/styles");
var _useResizeObserver = require("@mui/x-internals/useResizeObserver");
var _useGridRootProps = require("../hooks/utils/useGridRootProps");
var _useGridPrivateApiContext = require("../hooks/utils/useGridPrivateApiContext");
var _jsxRuntime = require("react/jsx-runtime");
const DetailPanel = (0, _styles.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'DetailPanel',
  overridesResolver: (props, styles) => styles.detailPanel
})(({
  theme
}) => ({
  width: 'calc(var(--DataGrid-rowWidth) - var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
  backgroundColor: (theme.vars || theme).palette.background.default,
  overflow: 'auto'
}));
function GridDetailPanel(props) {
  const {
    rowId,
    height,
    className,
    children
  } = props;
  const apiRef = (0, _useGridPrivateApiContext.useGridPrivateApiContext)();
  const ref = React.useRef(null);
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const ownerState = rootProps;
  const hasAutoHeight = height === 'auto';
  React.useLayoutEffect(() => {
    if (hasAutoHeight && typeof ResizeObserver === 'undefined') {
      // Fallback for IE
      apiRef.current.storeDetailPanelHeight(rowId, ref.current.clientHeight);
    }
  }, [apiRef, hasAutoHeight, rowId]);
  (0, _useResizeObserver.useResizeObserver)(ref, entries => {
    const [entry] = entries;
    const observedHeight = entry.borderBoxSize && entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.contentRect.height;
    apiRef.current.storeDetailPanelHeight(rowId, observedHeight);
  }, hasAutoHeight);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(DetailPanel, {
    ref: ref,
    ownerState: ownerState,
    role: "presentation",
    style: {
      height
    },
    className: className,
    children: children
  });
}
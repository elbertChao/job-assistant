import { jsx as _jsx } from "react/jsx-runtime";
const LoadingSpinner = () => {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
};
export default LoadingSpinner;

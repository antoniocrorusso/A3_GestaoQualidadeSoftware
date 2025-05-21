"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateToInput = void 0;
const date_fns_1 = require("date-fns");
const formatDateToInput = (date) => {
    return (0, date_fns_1.format)(new Date(date), 'yyyy-MM-dd');
};
exports.formatDateToInput = formatDateToInput;

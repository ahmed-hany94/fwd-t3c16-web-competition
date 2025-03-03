"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importStar(require("express"));
const constants_1 = require("./common/constants");
const db_1 = require("./db");
const routes_1 = require("./routes");
// **********************************************
// Connect to database
(async function () {
    if ((await (0, db_1.connect_db)()) === false) {
        process.exit(process.exitCode);
    }
})();
// **********************************************
// Setup express server
const app = (0, express_1.default)();
exports.app = app;
// **********************************************
// Setup express middleware
app.use((0, express_1.json)());
// **********************************************
// Setup express router
app.use('/api', routes_1.router);
// **********************************************
// Express Server Listen
app.listen(constants_1.PORT, function () {
    console.log(`Listening on http://localhost:${constants_1.PORT}`);
});

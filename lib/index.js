(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(1));
const coc_nvim_1 = __webpack_require__(2);
const CRYSTAL_MODE = [{ language: "crystal", scheme: "file" }];
function activate(context) {
    showStatusMessage("Loading extension for Crystal Language");
    let { subscriptions, logger } = context;
    // Holds the object of workspace configuration 
    // see JSON Schema in package.json (contributes.configuration)
    const config = coc_nvim_1.workspace.getConfiguration().get('crystal', {});
    const enable = config.enable;
    if (enable === false) {
        showStatusMessage("Crystal Language Server disabled.", false);
        logger.warn("Crystal Language Server disabled. Exit. ");
        return;
    }
    if (config.server != null) {
        const scryExecutablePath = config.server;
        if (scryExecutablePath == null && typeof scryExecutablePath === "string") {
            showStatusMessage("Could't find configuration for 'scry' language server.", false);
            logger.error(`Could't find configuration for by key 'crystal.scry.path'.`);
            return;
        }
        if (fs.existsSync(scryExecutablePath) === false) {
            showStatusMessage("Could't find 'scry' executable file.", false);
            logger.error(`The 'scry' executable file doeCrystal language server starteds not exit. "crystal.scry.path" - ${scryExecutablePath}`);
            return;
        }
        const command = scryExecutablePath;
        showStatusMessage(`Generated 'scry' command - ${command}`);
        const serverOptions = { command: "scry", args: [] };
        const clientOptions = {
            documentSelector: CRYSTAL_MODE,
            synchronize: {
                configurationSection: "crystal",
                fileEvents: coc_nvim_1.workspace.createFileSystemWatcher("**/*.cr")
            },
        };
        let client = new coc_nvim_1.LanguageClient('crystal', 'Crystal language server', serverOptions, clientOptions);
        let sub = client.start();
        client.onReady().then(() => {
            coc_nvim_1.workspace.showMessage(`Crystal language server started`, 'more');
        }, e => {
            // tslint:disable-next-line:no-console
            coc_nvim_1.workspace.showMessage(`Crystal language server start failed: ${e.message}`, 'error');
        });
        subscriptions.push(sub);
    }
}
exports.activate = activate;
function showStatusMessage(text, isProgressStatus = true) {
    coc_nvim_1.workspace.showMessage(text, 'warning');
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("coc.nvim");

/***/ })
/******/ ])));
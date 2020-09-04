"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
process.chdir(path.dirname(process.argv[1]));
var dotenv = require("dotenv");
dotenv.config();
process.env.percent = '100.00';
process.env.status = 'off';
var ws = require("websocket");
var telegraf_1 = require("telegraf");
var bot = new telegraf_1["default"](process.env.TOKEN);
var handleMessage_1 = require("./handleMessage");
bot.on('message', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(ctx.message.text);
                if (!(ctx.from.id == +process.env.ADMIN_ID)) return [3 /*break*/, 2];
                return [4 /*yield*/, handleMessage_1["default"](ctx)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
bot.launch();
var URL = 'wss://ws.garantex.io/?stream=btcrub';
var wsClient = new ws.client();
wsClient.on('connect', function (connection) {
    var success = false;
    connection.on('error', function (err) {
        console.log(err);
    });
    connection.on('close', function (code) {
        console.log('Connection closed with code: ' + code);
        wsClient.connect(URL);
    });
    connection.on('message', function (message) {
        var update = JSON.parse(message.utf8Data);
        if (update['success']) {
            success = true;
        }
        else if (update['btcrub.update']) {
            if (process.env.status == 'off')
                return;
            var ask = update['btcrub.update'].exchangers.index.ask[0];
            var bid = update['btcrub.update'].exchangers.index.bid[0];
            if ((parseFloat(bid.factor) * 100) > parseFloat(process.env.percent)) {
                var messageText = 'Ask: ' + (parseFloat(ask.factor) * 100).toFixed(2) + '% ' + ask.usdt_price + 'rub.\n' +
                    'Bid: ' + (parseFloat(bid.factor) * 100).toFixed(2) + '% ' + bid.usdt_price + 'rub.\n' +
                    'Dif: ' + ((parseFloat(ask.factor) - parseFloat(bid.factor)) * 100).toFixed(2) + '%, ' +
                    (parseFloat(ask.usdt_price) - parseFloat(bid.usdt_price)).toFixed(3) + 'rub.\n' +
                    'Vol: ' + parseFloat(bid.usdt_volume).toFixed(2) + 'usd. | ' + parseFloat(bid.amount).toFixed(2) + 'rub.';
                bot.telegram.sendMessage(process.env.ADMIN_ID, messageText);
            }
        }
        else if (!success) {
            console.log('Failed to connect to websocket server');
            console.log(update);
            process.exit(1);
        }
    });
});
wsClient.on('connectFailed', function (err) {
    console.log(err);
    wsClient.connect(URL);
});
wsClient.connect(URL);

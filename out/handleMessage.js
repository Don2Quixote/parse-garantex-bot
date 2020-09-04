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
var tg = null;
var sheduledEnablingBot = null;
var sheduleEnablingBot = function (timeout) {
    if (!tg)
        return; // No way "tg" is null
    sheduledEnablingBot = setTimeout(function () {
        process.env.status = 'on';
        tg.sendMessage(process.env.ADMIN_ID, 'ℹ️ Бот включился', {
            reply_markup: {
                keyboard: [
                    [{ text: '🟢' }]
                ],
                resize_keyboard: true
            }
        });
    }, 1000 * 60 * timeout);
};
var cancelEnablingBot = function () {
    clearInterval(sheduledEnablingBot);
};
exports["default"] = (function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var replyText, buttonText, replyText, replyText, replyText, buttonText, replyText, timeout, buttonText, replyText;
    return __generator(this, function (_a) {
        if (!ctx.message.text)
            return [2 /*return*/];
        if (!tg)
            tg = ctx.telegram;
        if (ctx.message.text.includes('/start')) {
            replyText = '👋 Здравствуйте. Чтобы поменять % для уведомления - просто отправьте число. Например: 5.5\n' +
                'Доступные команды: /status, /on, /off';
            buttonText = void 0;
            if (process.env.status == 'on')
                buttonText = '🟢';
            else
                buttonText = '🔴';
            ctx.reply(replyText, {
                reply_markup: {
                    keyboard: [
                        [{ text: buttonText }]
                    ],
                    resize_keyboard: true
                }
            });
        }
        else if (!isNaN(+ctx.message.text)) {
            process.env.percent = parseFloat(ctx.message.text).toFixed(2);
            replyText = '✅ Процент изменён на ' + parseFloat(ctx.message.text).toFixed(2);
            ctx.reply(replyText);
        }
        else if (ctx.message.text.includes('/status')) {
            replyText = (process.env.status == 'on' ? '🟢 Бот включен.' : '🔴 Бот выключен.') + ' ' +
                process.env.percent;
            ctx.reply(replyText);
        }
        else if (ctx.message.text.includes('/on') || ctx.message.text == '🔴') {
            replyText = '';
            if (process.env.status == 'on') {
                replyText =
                    'ℹ️ Бот уже включен';
            }
            else {
                cancelEnablingBot();
                process.env.status = 'on';
                replyText =
                    'ℹ️ Бот включен';
            }
            buttonText = void 0;
            if (process.env.status == 'on')
                buttonText = '🟢';
            else
                buttonText = '🔴';
            ctx.reply(replyText, {
                reply_markup: {
                    keyboard: [
                        [{ text: buttonText }]
                    ],
                    resize_keyboard: true
                }
            });
        }
        else if (ctx.message.text.includes('/off') || ctx.message.text == '🟢') {
            replyText = '';
            if (process.env.status == 'off') {
                replyText =
                    'ℹ️ Бот уже выключен';
            }
            else {
                process.env.status = 'off';
                replyText =
                    'ℹ️ Бот выключен';
                timeout = parseInt(ctx.message.text.split(' ')[1]);
                if (timeout) {
                    sheduleEnablingBot(timeout);
                }
            }
            buttonText = void 0;
            if (process.env.status == 'on')
                buttonText = '🟢';
            else
                buttonText = '🔴';
            ctx.reply(replyText, {
                reply_markup: {
                    keyboard: [
                        [{ text: buttonText }]
                    ],
                    resize_keyboard: true
                }
            });
        }
        else {
            replyText = 'ℹ️ Чтобы поменять % для уведомления - просто отправьте число. Например: 5.5';
            ctx.reply(replyText);
        }
        return [2 /*return*/];
    });
}); });

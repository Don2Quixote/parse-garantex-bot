import * as fs from 'fs'
import { TelegrafContext } from 'telegraf/typings/context'

let tg: TelegrafContext['telegram'] = null

let sheduledEnablingBot: NodeJS.Timeout = null

const sheduleEnablingBot = (timeout: number) => {
    if (!tg) return // No way "tg" is null
    sheduledEnablingBot = setTimeout(() => {
        process.env.status = 'on'
        tg.sendMessage(process.env.ADMIN_ID, 'ℹ️ Бот включился', {
            reply_markup: {
                keyboard: [
                    [ { text: '🟢' } ]
                ],
                resize_keyboard: true
            }
        })
    }, 1000 * 60 * timeout)
}

const cancelEnablingBot = () => {
    clearInterval(sheduledEnablingBot)
}

export default async (ctx: TelegrafContext) => {
    if (!ctx.message.text) return
    if (!tg) tg = ctx.telegram

    if (ctx.message.text.includes('/start')) {
        let replyText =
            '👋 Здравствуйте. Чтобы поменять % для уведомления - просто отправьте число. Например: 5.5\n' +
            'Доступные команды: /status, /on, /off'
        let buttonText
        if (process.env.status == 'on') buttonText = '🟢'
        else buttonText = '🔴' 
        ctx.reply(replyText, {
            reply_markup: {
                 keyboard: [
                     [ { text: buttonText } ]
                 ],
                 resize_keyboard: true
            }
        })
    } else if (!isNaN(+ctx.message.text)) {
        process.env.percent = parseFloat(ctx.message.text).toFixed(2)
        let replyText = 
            '✅ Процент изменён на ' + parseFloat(ctx.message.text).toFixed(2)
        ctx.reply(replyText)
    } else if (ctx.message.text.includes('/status')) {
       let replyText =
          (process.env.status == 'on' ? '🟢 Бот включен.' : '🔴 Бот выключен.') + ' ' +
          process.env.percent
        ctx.reply(replyText)
    } else if (ctx.message.text.includes('/on') || ctx.message.text == '🔴' ) {
        let replyText = ''
        if (process.env.status == 'on') {
            replyText =
                'ℹ️ Бот уже включен'
        } else {
            cancelEnablingBot()
            process.env.status = 'on'
            replyText =
                'ℹ️ Бот включен'
        }
        let buttonText
        if (process.env.status == 'on') buttonText = '🟢'
        else buttonText = '🔴' 
        ctx.reply(replyText, {
            reply_markup: {
                 keyboard: [
                     [ { text: buttonText } ]
                 ],
                 resize_keyboard: true
            }
        })
    } else if (ctx.message.text.includes('/off') || ctx.message.text == '🟢') { 
        let replyText = ''
        if (process.env.status == 'off') {
            replyText =
                'ℹ️ Бот уже выключен'
        } else {
            process.env.status = 'off'
            replyText =
                'ℹ️ Бот выключен'
            let timeout = parseInt(ctx.message.text.split(' ')[1])
            if (timeout) {
                sheduleEnablingBot(timeout)
            }
        }
        let buttonText
        if (process.env.status == 'on') buttonText = '🟢'
        else buttonText = '🔴' 
        ctx.reply(replyText, {
            reply_markup: {
                 keyboard: [
                     [ { text: buttonText } ]
                 ],
                 resize_keyboard: true
            }
        })
    } else {
        let replyText =
            'ℹ️ Чтобы поменять % для уведомления - просто отправьте число. Например: 5.5'
        ctx.reply(replyText)
    }
}

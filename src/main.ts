import * as path from 'path'
process.chdir(path.dirname(process.argv[1]))

import * as dotenv from 'dotenv'
dotenv.config()
process.env.percent = '100.00'
process.env.status = 'off'

import * as ws from 'websocket'
import Telegraf from 'telegraf'
import { TelegrafContext } from 'telegraf/typings/context'

const bot = new Telegraf(process.env.TOKEN)

import handleMessage from './handleMessage'
bot.on('message', async (ctx: TelegrafContext) => {
    console.log(ctx.message.text)
    if (ctx.from.id == +process.env.ADMIN_ID) {
        await handleMessage(ctx)
    }
})

bot.launch()

const URL = 'wss://ws.garantex.io/?stream=btcrub'

const wsClient = new ws.client()

wsClient.on('connect', (connection: ws.connection) => {
    let success = false
    connection.on('error', err => {
        console.log(err)
    })
    connection.on('close', code => {
        console.log('Connection closed with code: ' + code)
        wsClient.connect(URL)
    })
    connection.on('message', (message: ws.IMessage) => {
        let update = JSON.parse(message.utf8Data)
        if (update['success']) {
            success = true
        } else if (update['btcrub.update']) {
            if (process.env.status == 'off') return
            let ask = update['btcrub.update'].exchangers.index.ask[0]
            let bid = update['btcrub.update'].exchangers.index.bid[0]
            if ((parseFloat(bid.factor) * 100) > parseFloat(process.env.percent)) {
                let messageText =
                    'Ask: ' + (parseFloat(ask.factor) * 100).toFixed(2) + '% ' + ask.usdt_price + 'rub.\n' +
                    'Bid: ' + (parseFloat(bid.factor) * 100).toFixed(2) + '% ' + bid.usdt_price + 'rub.\n' +
                    'Dif: ' + ((parseFloat(ask.factor) - parseFloat(bid.factor)) * 100).toFixed(2) + '%, ' +
                        (parseFloat(ask.usdt_price) - parseFloat(bid.usdt_price)).toFixed(3) + 'rub.\n' +
                    'Vol: ' + parseFloat(bid.usdt_volume).toFixed(2) + 'usd. | ' + parseFloat(bid.amount).toFixed(2) + 'rub.' 
                bot.telegram.sendMessage(process.env.ADMIN_ID, messageText)
            }
        } else if (!success) {
            console.log('Failed to connect to websocket server')
            console.log(update)
            process.exit(1)
        }
    })
})

wsClient.on('connectFailed', err => {
    console.log(err)
    wsClient.connect(URL)
})

wsClient.connect(URL)


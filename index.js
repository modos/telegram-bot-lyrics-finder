const { Telegraf } = require('telegraf')
const axios = require('axios')
const config = require('./config.json')

const token = config.token

const bot = new Telegraf(token)

let artistName = ''
let songName = ''

bot.command('start', (ctx) => {
    ctx.reply('Lyrics Bot: ')
    artistName == '' ? ctx.reply('Enter Artist Name: ') : ctx.reply('Enter Song Name: ')
})

bot.on('text', async (ctx) => {
    if (artistName === '') {
        artistName = ctx.message.text
        ctx.reply('Enter Song Name: ')
    }else if (songName === '') {
        songName = ctx.message.text


        let lyric = await getLyric(artistName, songName)

        let result = ''
        let parts = [] //telegram has 4096 characters limit per message, so we must split lyric into several parts if it's longer
        let i = 0

        // if it is shorter than 4096 characters, so send it in one message, otherwise split it
        if (lyric.length < 4096) {
            ctx.reply(lyric)
            return
        }

        while (i < lyric.length) {
            result = result + lyric[i]

            if (result.length > 4090) {
                parts.push(result)
                result = ''
            }

            i = i + 1
        }

        if (result.length > 0) {
            parts.push(result)
        }

        parts.forEach(element => {
            ctx.reply(element)
        })

        artistName = ''
        songName = ''
        parts = ''
        result = ''


    }
})

// now lunch the bot
bot.launch()

async function getLyric(artist, song) {
    const req = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${song}`)

    return req.data.lyrics
}
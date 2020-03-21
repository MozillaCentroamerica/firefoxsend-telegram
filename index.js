const Telegraf = require('telegraf') // https://www.npmjs.com/package/telegraf
const fs = require('fs')
const http = require('http');
const https = require('https');
const exec = require('child_process').exec;
const decode = require('unescape');

/**
 * Api key de telegram generado por @BotFather
 */
const bot = new Telegraf('token...')

/**
 * Comandos del bot de telegram
 */
bot.hears('bot', (ctx) => ctx.reply('Quien me ha invocado?'))
bot.command('/joke', (ctx) => joke(ctx))
bot.command('/mozilla', (ctx) => mozilla(ctx))
 
/**
 * 
 * @param {*} command 
 * @param {*} callback 
 * Funcion que ejecuta un comando de terminal y captura la salida en un callback
 */
let execute = function (command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};
/**
 * 
 * @param {*} ctx 
 * Funcion de ejemplo para subir archivos a telegram a travez de firefox send
 */
let mozilla = function(ctx){
    let message = ctx.update.message
    ctx.reply("Enviando archivo, espere...");
    let cmd = message.text.split(" ")
    console.log(cmd)
    // el commando ffsend tiene que ser descargado de https://github.com/timvisee/ffsend/releases dependiendo de su S.O.
    execute(`./ffsend upload ${cmd[1]}`, (res)=>{
        ctx.reply(res)
    })
}

/**
 * 
 * @param {*} ctx 
 * Funcion que obtiene un chiste sobre Chuck Norris y lo responde en el chat
 */
let joke = function (ctx) {

    var url = 'https://geek-jokes.sameerkumar.website/api';
    // Hacer peticion HTTP GET
    https.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var joke = JSON.parse(body);
            console.log("Got a response: ", joke);
            ctx.reply(decode(joke))
        });
    }).on('error', function(e){
          ctx.reply('Ocurrio un error con el servidor de chistes, :( ');
    });
}

bot.startPolling()

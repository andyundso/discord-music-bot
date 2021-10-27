import * as Discord from 'discord.js'
import {
    DMChannel,
    Message,
    MessageEmbed,
    NewsChannel,
    Snowflake,
    TextChannel,
    VoiceChannel,
    VoiceConnection
} from 'discord.js'
import {remastered} from "./remastered";
import {skip} from "./commands/skip";
import {stop} from "./commands/stop";
import {displayQueue} from "./commands/displayQueue";
import {findYouTube} from "./commands/findYoutube";
import {findSoundcloud} from "./commands/findSoundcloud";

require('dotenv').config()

export interface Song {
    source: string,
    title: string,
    url: string
}

export interface QueueConstruct {
    textChannel: TextChannel | DMChannel | NewsChannel,
    voiceChannel: VoiceChannel,
    connection: VoiceConnection | null,
    songs: Array<Song>,
    volume: number,
    playing: Boolean,
}

const client = new Discord.Client();
client.login(process.env.TOKEN);

export const queue = new Map<Snowflake, QueueConstruct>();
const prefix = process.env.PREFIX as string;

client.once('ready', () => {
    console.log('Ready!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', async (message: Message) => {
    if (message.author.bot) {
        return
    }

    if (!message.content.startsWith(prefix)) {
        return;
    }

    const serverQueue = queue.get(message.guild!.id);

    const commandMapping: any = {
        "youtube": findYouTube,
        "yt": findYouTube,
        "skip": skip,
        "stop": stop,
        "queue": displayQueue,
        "banger": playBanger,
        "soundcloud": findSoundcloud,
        "sc": findSoundcloud,
        "gugu": () => message.channel.send("gaga")
    }

    const command = message.content.split(' ')[0].replace(prefix,'').toLowerCase();

    console.log(command);
    if (commandMapping[command]){
        commandMapping[command](message, serverQueue);
    } else {
        message.channel.send("Brüeder red Bot mit mir");
        message.channel.send(helpMessage())
        
    }
    

    // if (message.content.startsWith(`${prefix}youtube`)) {
    //     findYouTube(message, serverQueue);
    //     return;
    // } else if (message.content.startsWith(`${prefix}skip`)) {
    //     skip(message, serverQueue);
    //     return;
    // } else if (message.content.startsWith(`${prefix}stop`)) {
    //     stop(message, serverQueue);
    //     return;
    // } else if (message.content.startsWith(`${prefix}queue`)) {
    //     displayQueue(message, serverQueue);
    //     return;
    // } else if (message.content.startsWith(`${prefix}banger`)) {
    //     message.content = `!play ${remastered[Math.floor(Math.random() * remastered.length)]}`
    //     findYouTube(message, serverQueue);
    //     return;
    // } else if (message.content.startsWith(`${prefix}soundcloud`)) {
    //     findSoundcloud(message, serverQueue)
    //     return;
    // } else {
    //     message.channel.send("Brüeder red Bot mit mir");
    //     message.channel.send(helpMessage())
    // }
})

function playBanger(message :Message, serverQueue:QueueConstruct | undefined) {
    message.content = `!play ${remastered[Math.floor(Math.random() * remastered.length)]}`
    findYouTube(message, serverQueue);
}


function helpMessage(): MessageEmbed {
    const embed = new MessageEmbed()
    embed.title = 'Mozart-Bot Hiuf'
    embed.fields = [
        {
            name: `${prefix}soundcloud`,
            value: 'Einen Song von Soundcloud abspielen',
            inline: true
        },
        {
            name: `${prefix}youtube`,
            value: 'Einen Song von Youtube abspielen',
            inline: true
        }, {
            name: `${prefix}skip`,
            value: 'Einen Song überspringen',
            inline: true
        }, {
            name: `${prefix}stop`,
            value: 'Wiedergabe stoppen',
            inline: true
        }, {
            name: `${prefix}queue`,
            value: 'Aktuelle Queue anzeigen lassen',
            inline: true
        }, {
            name: `${prefix}banger`,
            value: 'En Banger abspiele',
            inline: true
        }
    ]

    return embed
}

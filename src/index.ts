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

    if (message.content.startsWith(`${prefix}youtube`)) {
        findYouTube(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}queue`)) {
        displayQueue(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}banger`)) {
        message.content = `!play ${remastered[Math.floor(Math.random() * remastered.length)]}`
        findYouTube(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}soundcloud`)) {
        findSoundcloud(message, serverQueue)
        return;
    } else {
        message.channel.send("Brüeder red Bot mit mir");
        message.channel.send(helpMessage())
    }
})

function helpMessage(): MessageEmbed {
    const embed = new MessageEmbed()
    embed.title = 'Mozart-Bot Hiuf'
    embed.fields = [
        {
            name: '!soundcloud',
            value: 'Einen Song von Soundcloud abspielen',
            inline: true
        },
        {
            name: '!youtube',
            value: 'Einen Song von Youtube abspielen',
            inline: true
        }, {
            name: '!skip',
            value: 'Einen Song überspringen',
            inline: true
        }, {
            name: '!stop',
            value: 'Wiedergabe stoppen',
            inline: true
        }, {
            name: '!queue',
            value: 'Aktuelle Queue anzeigen lassen',
            inline: true
        }, {
            name: '!banger',
            value: 'En Banger abspiele',
            inline: true
        }
    ]

    return embed
}

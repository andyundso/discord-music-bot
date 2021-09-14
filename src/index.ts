import * as Discord from 'discord.js'
import {
    DMChannel,
    Guild,
    Message,
    MessageEmbed,
    NewsChannel,
    Snowflake,
    TextChannel,
    VoiceChannel,
    VoiceConnection
} from 'discord.js'
import * as scrapper from 'youtube-scrapper'
import {YoutubeVideo} from "youtube-scrapper/dist/structures/YoutubeVideo";

require('dotenv').config()

interface Song {
    title: string,
    url: string
}

interface QueueConstruct {
    textChannel: TextChannel | DMChannel | NewsChannel,
    voiceChannel: VoiceChannel,
    connection: VoiceConnection | null,
    songs: Array<Song>,
    volume: number,
    playing: Boolean,
}

const weekday = new Array(7);
weekday[0] = "Suntig";
weekday[1] = "Mäntig";
weekday[2] = "Zischtig";
weekday[3] = "Mittwuch";
weekday[4] = "Dunschtig";
weekday[5] = "Fritig";
weekday[6] = "Samstig";

const client = new Discord.Client();
client.login(process.env.TOKEN);

const queue = new Map<Snowflake, QueueConstruct>();
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

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
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
    } else {
        message.channel.send("Brüeder red Bot mit mir");
        message.channel.send(helpMessage())
    }
})

async function execute(message: Message, serverQueue: QueueConstruct | undefined) {
    const args = message.content.split(" ");

    const voiceChannel = message.member!.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "Du musch imene Channel si zum Musig abspiele."
        );

    const permissions = voiceChannel.permissionsFor(message.client.user!);
    if (!permissions!.has("CONNECT") || !permissions!.has("SPEAK")) {
        return message.channel.send(
            "Leider hani kei Berechtigunge zum Channel, womit ich die Überdopeness ned chan abspiele :("
        );
    }

    let songInfo: YoutubeVideo;
    if (args.length <= 2) {
        songInfo = await scrapper.getVideoInfo(args[1])
    } else {
        const result = await scrapper.search([undefined, ...args].join(' '))
        songInfo = await scrapper.getVideoInfo(result.videos[0].id)
    }

    const song = {
        title: songInfo.info.title,
        url: songInfo.info.url,
    };

    if (!serverQueue) {
        // Creating the contract for our queue
        const queueConstruct: QueueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        // Setting the queue using our contract
        queue.set(message.guild!.id, queueConstruct);
        // Pushing the song to our songs array
        queueConstruct.songs.push(song);

        try {
            // Here we try to join the voicechat and save our connection into our object.
            queueConstruct.connection = await voiceChannel.join();
            // Calling the play function to start a song
            play(message.guild!, queueConstruct.songs[0]);
        } catch (err) {
            // Printing the error message if the bot fails to join the voicechat
            console.log(err);
            queue.delete(message.guild!.id);
            return message.channel.send(err as string);
        }
    } else {
        serverQueue?.songs.push(song);
        console.log(serverQueue?.songs);
        return message.channel.send(`${song.title} isch ide Queue!`);
    }
}

async function play(guild: Guild, song: Song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue?.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue?.connection?.play(await scrapper.download(song.url))
        .on("finish", () => {
            serverQueue?.songs.shift();
            play(guild, serverQueue?.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher?.setVolumeLogarithmic(serverQueue!.volume / 5);
    serverQueue?.textChannel.send(`Banger-${weekday[new Date().getDay()]} mit: **${song.title}**`);
}

function skip(message: Message, serverQueue: QueueConstruct | undefined) {
    if (!message.member?.voice.channel)
        return message.channel.send(
            "Du musch imene Channel si zum d'Musig überspringe"
        );
    if (!serverQueue)
        return message.channel.send("bro was wetsch du, es giht nüt zum skippe.");
    serverQueue?.connection?.dispatcher.end();
}

function stop(message: Message, serverQueue: QueueConstruct | undefined) {
    if (!message.member?.voice.channel)
        return message.channel.send(
            "Du musch imene Channel si zum d'Musig stoppe."
        );

    if (!serverQueue)
        return message.channel.send("bro was wetsch du, es giht nüt zum stoppe.");

    serverQueue.songs = [];
    serverQueue.connection?.dispatcher.end();
}

function helpMessage(): MessageEmbed {
    const embed = new MessageEmbed()
    embed.title = 'Mozart-Bot Hiuf'
    embed.fields = [
        {
            name: '!play',
            value: 'Einen Song abspielen',
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
        }
    ]

    return embed
}

function displayQueue(message: Message, serverQueue: QueueConstruct | undefined) {
    if (!serverQueue || !serverQueue.connection) {
        message.channel.send('Momentan kei Banger am blaste.')
    } else {
        message.channel.send(serverQueue.songs.map((song, index) => `${index + 1}: ${song.title}`))
    }
}

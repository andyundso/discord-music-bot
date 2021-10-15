import {Guild, Message, VoiceChannel} from "discord.js";
import {queue, QueueConstruct, Song} from "../index";
import scdl from "soundcloud-downloader";
import * as ytdl from "ytdl-core";

const weekday = new Array(7);
weekday[0] = "Suntig";
weekday[1] = "Mäntig";
weekday[2] = "Zischtig";
weekday[3] = "Mittwuch";
weekday[4] = "Dunschtig";
weekday[5] = "Fritig";
weekday[6] = "Samstig";

export async function checkPrerequisite(message: Message) {
    await message.channel.send('ein Moment, luege grad na öbi was han ...')

    const voiceChannel = message.member!.voice.channel;
    if (!voiceChannel) {
        await message.channel.send("Du musch imene Channel si zum Musig abspiele.");
        return false;
    }

    const permissions = voiceChannel.permissionsFor(message.client.user!);
    if (!permissions!.has("CONNECT") || !permissions!.has("SPEAK")) {
        await message.channel.send(
            "Leider hani kei Berechtigunge zum Channel, womit ich die Überdopeness ned chan abspiele :("
        );
        return false;
    }

    return true;
}

export async function sendToQueue(serverQueue: QueueConstruct | undefined, message: Message, voiceChannel: VoiceChannel, song: Song) {
    if (!serverQueue) {
        // Creating the contract for our queue
        const queueConstruct = constructQueue(message, voiceChannel)
        queueConstruct.songs.push(song);

        try {
            // Here we try to join the voice chat and save our connection into our object.
            queueConstruct.connection = await voiceChannel.join();
            // Calling the play function to start a song
            play(message.guild!, queueConstruct.songs[0]);
        } catch (err) {
            // Printing the error message if the bot fails to join the voice chat
            console.log(err);
            queue.delete(message.guild!.id);
            return message.channel.send(err as string);
        }
    } else {
        serverQueue?.songs.push(song);
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

    let downloadedFile;
    if (song.source === 'soundcloud') {
        downloadedFile = await scdl.download(song.url);
    } else {
        downloadedFile = ytdl.default(song.url, {filter: 'audioonly', dlChunkSize: 0})
    }

    const dispatcher = serverQueue?.connection?.play(downloadedFile)
        .on("finish", () => {
            serverQueue?.songs.shift();
            play(guild, serverQueue?.songs[0]);
        })
        .on("error", error => console.error(error));

    dispatcher?.setVolumeLogarithmic(serverQueue!.volume / 5);
    serverQueue?.textChannel.send(`Banger-${weekday[new Date().getDay()]} mit: **${song.title}**`);
}

function constructQueue(message: Message, voiceChannel: VoiceChannel): QueueConstruct {
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
    return queueConstruct
}

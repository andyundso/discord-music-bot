import {Message} from "discord.js";
import {QueueConstruct} from "../index";

export function displayQueue(message: Message, serverQueue: QueueConstruct | undefined) {
    if (!serverQueue || !serverQueue.connection) {
        message.channel.send('Momentan kei Banger am blaste.')
    } else {
        message.channel.send(serverQueue.songs.map((song, index) => `${index + 1}: ${song.title}`))
    }
}

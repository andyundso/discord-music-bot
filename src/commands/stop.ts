import {Message} from "discord.js";
import {QueueConstruct} from "../index";

export function stop(message: Message, serverQueue: QueueConstruct | undefined) {
    if (!message.member?.voice.channel)
        return message.channel.send(
            "Du musch imene Channel si zum d'Musig stoppe."
        );

    if (!serverQueue)
        return message.channel.send("bro was wetsch du, es giht nüt zum stoppe.");

    serverQueue.songs = [];
    serverQueue.connection?.dispatcher.end();
}

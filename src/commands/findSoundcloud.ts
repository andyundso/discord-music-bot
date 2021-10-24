import {Message} from "discord.js";
const scdl = require('soundcloud-downloader').default;
import {QueueConstruct} from "../index";
import {checkPrerequisite, sendToQueue} from "./commons";

export async function findSoundcloud(message: Message, serverQueue: QueueConstruct | undefined) {
    if (!(await checkPrerequisite(message))) {
        return;
    }

    const args = message.content.split(" ");
    const voiceChannel = message.member!.voice.channel!;

    let songInfo;
    try {
        songInfo = await scdl.getInfo(args[1])
        console.log(songInfo)
    } catch (error) {
        console.error(error)
        await message.channel.send('sorry, da hed was ned klapped :(')
        return;
    }

    const song = {
        source: "soundcloud",
        title: songInfo.title!,
        url: args[1],
    };

    sendToQueue(serverQueue, message, voiceChannel, song);
}

import {Message} from "discord.js";
import {QueueConstruct} from "../interfaces";
import ytdl from "ytdl-core";
import {sendToQueue} from "../commands/commons";
import {youtube} from "scrape-youtube";

export async function youtubeUrl(message: Message, serverQueue: QueueConstruct | undefined) {
    const args = message.content.split(' ');
    const voiceChannel = message.member!.voice.channel!;

    const songInfo = await ytdl.getInfo(args[1]);

    const song = {
        source: 'youtube',
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    await sendToQueue(serverQueue, message, voiceChannel, song);
}

export async function youtubeSearch(message: Message, serverQueue: QueueConstruct | undefined) {
    const args = message.content.split(' ');
    const voiceChannel = message.member!.voice.channel!;

    const results = await youtube.search([undefined, ...args].join(' '));
    const songInfo = await ytdl.getInfo(results.videos[0].link);

    const song = {
        source: 'youtube',
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    await sendToQueue(serverQueue, message, voiceChannel, song);
}

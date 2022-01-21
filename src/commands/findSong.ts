import {Message} from "discord.js";
import {QueueConstruct} from "../interfaces";
import {checkPrerequisite} from "./commons";
import {soundcloudUrl} from "../sources/soundcloud";
import {youtubeSearch, youtubeUrl} from "../sources/youtube";

async function findSong(message: Message, serverQueue: QueueConstruct | undefined) {
    if (!(await checkPrerequisite(message))) {
        console.log('hello')
        return;
    }

    const soundCloudUrlRegex = new RegExp('soundcloud\.com', 'g');
    const youTubeUrlRegex = new RegExp('youtube\.', 'g');

    const args = message.content.split(' ');

    try {
        if (soundCloudUrlRegex.test(args[1])) {
            await soundcloudUrl(message, serverQueue)
        } else if (youTubeUrlRegex.test(args[1])) {
            await youtubeUrl(message, serverQueue);
        } else {
            await youtubeSearch(message, serverQueue)
        }
    } catch (error) {
        console.error(error)
        await message.channel.send('sorry, da hed was ned klapped :(');
        return;
    }
}

export default findSong;

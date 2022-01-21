import { Message } from 'discord.js';
import ytdl, { videoInfo } from 'ytdl-core';

import { youtube } from 'scrape-youtube';
import { checkPrerequisite, sendToQueue } from './commons';
import { QueueConstruct } from '../interfaces';

async function searchYouTubeVideo(query: string): Promise<videoInfo> {
  const results = await youtube.search(query);
  return ytdl.getInfo(results.videos[0].link);
}

async function findYouTube(message: Message, serverQueue: QueueConstruct | undefined) {
  if (!(await checkPrerequisite(message))) {
    return;
  }

  const args = message.content.split(' ');
  const voiceChannel = message.member!.voice.channel!;

  let songInfo: videoInfo;
  try {
    if (args.length <= 2) {
      songInfo = await ytdl.getInfo(args[1]);
    } else {
      songInfo = await searchYouTubeVideo([undefined, ...args].join(' '));
    }
  } catch (error) {
    console.error(error);
    await message.channel.send('sorry, da hed was ned klapped :(');
    return;
  }

  const song = {
    source: 'youtube',
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  sendToQueue(serverQueue, message, voiceChannel, song);
}

export default findYouTube;

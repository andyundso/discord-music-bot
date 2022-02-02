import { Message } from 'discord.js';
import { QueueConstruct } from '../interfaces';
import { sendToQueue } from '../commands/commons';

const scdl = require('soundcloud-downloader').default;

async function soundcloudUrl(message: Message, serverQueue: QueueConstruct | undefined) {
  const args = message.content.split(' ');
  const voiceChannel = message.member!.voice.channel!;

  let songInfo;
  try {
    songInfo = await scdl.getInfo(args[1]);
  } catch (error) {
    console.error(error);
    await message.channel.send('sorry, da hed was ned klapped :(');
    return;
  }

  const song = {
    source: 'soundcloud',
    title: songInfo.title!,
    url: args[1],
  };

  sendToQueue(serverQueue, message, voiceChannel, song);
}

export default soundcloudUrl;

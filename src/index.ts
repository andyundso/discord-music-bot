import * as Discord from 'discord.js';
import {
  Message,
  MessageEmbed,
} from 'discord.js';
import { queue } from './interfaces';
import stop from './commands/stop';
import skip from './commands/skip';
import findYouTube from './commands/findYoutube';
import findSoundcloud from './commands/findSoundcloud';
import displayQueue from './commands/displayQueue';
import playBanger from './commands/playBanger';

require('dotenv').config();

const prefix = process.env.PREFIX as string;

function helpMessage(): MessageEmbed {
  const embed = new MessageEmbed();
  embed.title = 'Mozart-Bot Hiuf';
  embed.fields = [
    {
      name: `${prefix}soundcloud`,
      value: 'Einen Song von Soundcloud abspielen',
      inline: true,
    },
    {
      name: `${prefix}youtube`,
      value: 'Einen Song von Youtube abspielen',
      inline: true,
    }, {
      name: `${prefix}skip`,
      value: 'Einen Song überspringen',
      inline: true,
    }, {
      name: `${prefix}stop`,
      value: 'Wiedergabe stoppen',
      inline: true,
    }, {
      name: `${prefix}queue`,
      value: 'Aktuelle Queue anzeigen lassen',
      inline: true,
    }, {
      name: `${prefix}banger`,
      value: 'En Banger abspiele',
      inline: true,
    },
  ];

  return embed;
}

const client = new Discord.Client();
client.login(process.env.TOKEN);

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
    return;
  }

  if (!message.content.startsWith(prefix)) {
    return;
  }

  const serverQueue = queue.get(message.guild!.id);

  const commandMapping: any = {
    youtube: findYouTube,
    yt: findYouTube,
    skip,
    stop,
    queue: displayQueue,
    banger: playBanger,
    soundcloud: findSoundcloud,
    sc: findSoundcloud,
    gugu: () => message.channel.send('gaga'),
  };

  const command = message.content.split(' ')[0].replace(prefix, '').toLowerCase();

  if (commandMapping[command]) {
    commandMapping[command](message, serverQueue);
  } else {
    message.channel.send('Brüeder red Bot mit mir');
    message.channel.send(helpMessage());
  }
});

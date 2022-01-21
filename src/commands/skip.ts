import { Message } from 'discord.js';
import { QueueConstruct } from '../interfaces';

function skip(message: Message, serverQueue: QueueConstruct | undefined) {
  if (!message.member?.voice.channel) {
    return message.channel.send(
      "Du musch imene Channel si zum d'Musig überspringe",
    );
  }

  if (!serverQueue) {
    return message.channel.send('bro was wetsch du, es giht nüt zum skippe.');
  }

  serverQueue?.connection?.dispatcher.end();
  return null;
}

export default skip;

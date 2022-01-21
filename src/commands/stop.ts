import { Message } from 'discord.js';
import { QueueConstruct } from '../interfaces';

function stop(message: Message, serverQueue: QueueConstruct | undefined) {
  const queue = serverQueue;

  if (!message.member?.voice.channel) {
    return message.channel.send(
      "Du musch imene Channel si zum d'Musig stoppe.",
    );
  }

  if (!serverQueue) { return message.channel.send('bro was wetsch du, es giht nüt zum stoppe.'); }

  if (queue !== undefined) {
    queue.songs = [];
    queue.connection?.dispatcher.end();
  }

  return null;
}

export default stop;

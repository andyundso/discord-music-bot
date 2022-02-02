import { Message } from 'discord.js';
import { QueueConstruct } from '../interfaces';
import { youtubeUrl } from '../sources/youtube';

const remastered = [
  'https://www.youtube.com/watch?v=DxHDxB2mVg4', // HRR
  'https://www.youtube.com/watch?v=YaASkhAwkrY', // Chill
  'https://www.youtube.com/watch?v=QlWMQI3kQ7w', // brasilianischi Flow
  'https://www.youtube.com/watch?v=6YuitpJ6zvk', // divinorum bay rundi
  'https://www.youtube.com/watch?v=fovqQn8ZF6U', // quoli drbt3
  'https://www.youtube.com/watch?v=f72OYEvKw0U', // sven chiller
  'https://www.youtube.com/watch?v=ycMbnaOYJsg', // ich los dir zue
  'https://www.youtube.com/watch?v=ADuI5Jtgp7Y', // mini stund
  'https://www.youtube.com/watch?v=Xl9MAaxNfok', // gangster radio
  'https://www.youtube.com/watch?v=Te_3GNJXRI8', // peaky blinder
  'https://www.youtube.com/watch?v=mP7QWjJCIw8', // da baby zh
  'https://www.youtube.com/watch?v=7A--pKIUhGg', // erwache
  'https://www.youtube.com/watch?v=ZFUVgDhtyzw', // dope deala assassin
  'https://www.youtube.com/watch?v=rGYGqXnVW9w', // KUSH
  'https://www.youtube.com/watch?v=tgPTUSeSEBA', // Paffee
  'https://www.youtube.com/watch?v=OcRynMc8lLc', // divinorum 6tel
  'https://www.youtube.com/watch?v=tbH9mXQipDM', // kollegah drive by
  'https://www.youtube.com/watch?v=o875br8N4Fs', // pitbull hotel room service
  'https://www.youtube.com/watch?v=PP0uRgsQtJk', // pitbull dont stop the party
  'https://www.youtube.com/watch?v=iP9FfkcaTLw', // pitbull i know you want me
  'https://www.youtube.com/watch?v=KvMoU38_zy0', // polish cow
];

function playBanger(message: Message, serverQueue: QueueConstruct | undefined) {
  const commandMessage = { ...message } as Message;
  commandMessage.content = `!play ${remastered[Math.floor(Math.random() * remastered.length)]}`;
  youtubeUrl(commandMessage, serverQueue);
}

export default playBanger;

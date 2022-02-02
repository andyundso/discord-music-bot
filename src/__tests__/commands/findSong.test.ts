import {
  Client, Guild, Message, SnowflakeUtil, TextChannel,
} from 'discord.js';
import soundcloudUrl from '../../sources/soundcloud';
import { youtubeSearch, youtubeUrl } from '../../sources/youtube';
import findSong from '../../commands/findSong';
import { checkPrerequisite } from '../../commands/commons';
import mocked = jest.mocked;

jest.mock('../../sources/soundcloud');
jest.mock('../../sources/youtube');
jest.mock('../../commands/commons');

const mockedSoundcloudUrl = mocked(soundcloudUrl, true);
const mockedYoutubeSearch = mocked(youtubeSearch, true);
const mockedYoutubeUrl = mocked(youtubeUrl, true);
const mockedCheckRequisite = mocked(checkPrerequisite, true);

const client = new Client({ restSweepInterval: 0 });
const guild = new Guild(client, { id: SnowflakeUtil.generate() });
const textChannel = new TextChannel(guild, { id: SnowflakeUtil.generate() });

mockedCheckRequisite.mockReturnValue(new Promise((resolve) => {
  resolve(true);
}));

test('should search on SoundCloud for SoundCloud URLs', async () => {
  const message = new Message(client, { id: SnowflakeUtil.generate() }, textChannel);
  message.content = '!play https://soundcloud.com/peetbeats/dj-vadim-feat-motion-man-the-terrorist-peet-remix';

  await findSong(message, undefined);
  expect(mockedSoundcloudUrl.mock.calls).toHaveLength(1);
});

test('should search on YouTube for YouTube URLs', async () => {
  const message = new Message(client, { id: SnowflakeUtil.generate() }, textChannel);
  message.content = '!play https://www.youtube.com/watch?v=4Gaa78rwd_4';

  await findSong(message, undefined);
  expect(mockedYoutubeUrl.mock.calls).toHaveLength(1);
});

test('should search on YouTube for anything else', async () => {
  const message = new Message(client, { id: SnowflakeUtil.generate() }, textChannel);
  message.content = '!play grüezi mitenand ide Schwiz';

  await findSong(message, undefined);
  expect(mockedYoutubeSearch.mock.calls).toHaveLength(1);
});

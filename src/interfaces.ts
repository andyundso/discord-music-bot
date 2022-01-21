import {
  DMChannel, NewsChannel, Snowflake, TextChannel, VoiceChannel, VoiceConnection,
} from 'discord.js';

export interface Song {
  source: string,
  title: string,
  url: string
}

export interface QueueConstruct {
  textChannel: TextChannel | DMChannel | NewsChannel,
  voiceChannel: VoiceChannel,
  connection: VoiceConnection | null,
  songs: Array<Song>,
  volume: number,
  playing: Boolean,
}

export const queue = new Map<Snowflake, QueueConstruct>();

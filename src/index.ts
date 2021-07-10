import { BlockMusicPlayer } from "./mohsen.coder/MusicPlayerGeneratorTypes/BlockMusicPlayer";
import { Music } from "./mohsen.coder/Music";
import { MusicPlayer } from "./mohsen.coder/MusicPlayer";

export function newMusic(): Music{
    return new Music();
}

export function musicPlayer(wrapElemenClassName: string, musicList: Array<Music>, options?: object): MusicPlayer{
    return new MusicPlayer(wrapElemenClassName, musicList, options);
}
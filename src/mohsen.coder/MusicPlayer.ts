import { Music } from "./Music";

export class MusicPlayer {

    private shuffle: boolean = false;
    private repeat: boolean = false;
    private musics: Array<Music> = []
    private musicPlayerWrapElment: Element | null = null;

    constructor(className: string, musics?: Array<Music>) {

        this.musicPlayerWrapElment = document.querySelector(className)
        
        if (!this.musicPlayerWrapElment) {
            alert(`Error: ${className} Not Found!!`);
            return;
        }

        if (musics && musics.length > 0)
            this.musics = musics;
    }
}
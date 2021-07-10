import { Music } from "./Music";
import { BlockMusicPlayer } from "./MusicPlayerGeneratorTypes/BlockMusicPlayer";
export class MusicPlayer {

    private musicPlayerWrapElment: Element | null = null;
    private options: 
    { 
        type: string, 
        showMusicList: boolean, 
        autoGoToNextMusic: boolean,
        likeFunction?: () => {} 
    } = {
        type: "block", 
        showMusicList: true,
        autoGoToNextMusic: true
        
    }
    private musicPlayer!: BlockMusicPlayer;

    constructor(wrapElemenClassName: string, musicList: Array<Music>, options?: object) {
        const mappedMusicList = musicList.map(music => new Music(music));
        
        this.musicPlayerWrapElment = document.querySelector(wrapElemenClassName)
        
        if (!this.musicPlayerWrapElment) {
            alert(`Error: ${wrapElemenClassName} Not Found!!`);
            return;
        }

        if(musicList.length === 0){
            alert(`Error: Music list can not be empty!!`);
            return;
        }
        
        if (options) Object.assign(this.options, options);
        
        if(this.options.type === "block"){
            this.musicPlayer = new BlockMusicPlayer(
                wrapElemenClassName, 
                mappedMusicList, 
                this.options.showMusicList, 
                this.options.autoGoToNextMusic
                );
            this.musicPlayer.initialize()
        }
    }
}
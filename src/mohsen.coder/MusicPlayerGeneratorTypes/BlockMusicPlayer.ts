import { Music } from "../Music";

export class BlockMusicPlayer {

    private wrapElemnt!: HTMLElement | null;
    private musicPlayerEl!: HTMLElement;
    private poster!: HTMLElement;
    private posterImage!: HTMLElement;
    private title!: HTMLElement;
    private description!: HTMLElement;
    private controlButtonsOne!: HTMLElement;
    private playPauseButtonsWrap!: HTMLElement;
    private playButton!: HTMLElement;
    private pauseButton!: HTMLElement;
    private nextButton!: HTMLElement;
    private previousButton!: HTMLElement;
    private controlButtonsTwo!: HTMLElement;
    private shuffleButton!: HTMLElement;
    private repeatButton!: HTMLElement;
    private likeButton!: HTMLElement;
    private bullet!: HTMLElement;
    private line!: HTMLElement;
    private seek!: HTMLElement;
    private audioPlayer!: HTMLAudioElement;

    private musicList: Array<Music> = [];
    private shuffleMusicList: Array<Music> = [];
    private isShuffle: boolean = false;
    private currentTime: number = 0;
    private isPlay: boolean = false
    private timer: NodeJS.Timer | null = null;
    private isDragging: boolean = false;
    private loopIsOn: boolean = false;
    private currentMusic!: Music;
    private showMusicList: boolean = false;
    private onLikeFunction?: () => {};
    private onDislikeFunction?: () => {};

    constructor(
        wrapClassName: string,
        musicList: Array<Music>,
        showMusicListStatus: boolean,
        autoGoToNextMusic: boolean,
        onLikeFunction?: () => {},
        onDislikeFunction?: () => {}
    ) {
        this.musicList = musicList;
        this.currentMusic = this.musicList[0]
        this.showMusicList = showMusicListStatus;
        this.wrapElemnt = document.querySelector(wrapClassName);
        if (onLikeFunction) this.onLikeFunction = onLikeFunction;
        if (onDislikeFunction) this.onDislikeFunction = onDislikeFunction;

    }

    public initialize(): void {
        this.musicPlayerEl = document.createElement('div');
        this.musicPlayerEl.classList.add('rw__music-player');

        this.poster = document.createElement('figure')
        this.poster.classList.add('rw__music-player__poster')
        this.posterImage = document.createElement('img');
        this.posterImage.setAttribute('src', this.currentMusic.getPosterUrl());
        this.poster.appendChild(this.posterImage)

        this.title = document.createElement('h3');
        this.title.classList.add('rw__music-player__title')
        this.title.innerText = this.currentMusic.getTitle()

        this.description = document.createElement('p')
        this.description.classList.add('rw__music-player__description');
        this.description.innerText = this.currentMusic.getDescription();

        this.controlButtonsOne = document.createElement('div')
        this.controlButtonsOne.classList.add('rw__music-player__control-buttons--one')

        this.previousButton = document.createElement('div')
        this.previousButton.classList.add('rw__music-player__control-buttons__previous-button')
        this.previousButton.innerHTML = `<button><i class="fas fa-step-backward"></i></button>`;
        this.previousButton.addEventListener('click', this.goToPreviousMusic)

        this.playPauseButtonsWrap = document.createElement('div')
        this.playPauseButtonsWrap.classList.add('rw__music-player__control-buttons__play-button')
        //<button><i class="fas fa-pause"></i></button>
        this.playButton = document.createElement('button')
        this.playButton.innerHTML = `<i class="fas fa-play"></i>`
        this.playButton.addEventListener('click', this.playMusic)

        this.pauseButton = document.createElement('button')
        this.pauseButton.innerHTML = `<i class="fas fa-pause"></i>`
        this.pauseButton.addEventListener('click', this.pauseMusic)
        this.pauseButton.style.display = 'none'

        this.playPauseButtonsWrap.appendChild(this.playButton)
        this.playPauseButtonsWrap.appendChild(this.pauseButton)

        this.nextButton = document.createElement('div')
        this.nextButton.classList.add('rw__music-player__control-buttons__next-button')
        this.nextButton.innerHTML = `<button><i class="fas fa-step-forward"></i></button>`
        this.nextButton.addEventListener('click', this.goToNextMusic)

        this.controlButtonsOne.appendChild(this.previousButton);
        this.controlButtonsOne.appendChild(this.playPauseButtonsWrap);
        this.controlButtonsOne.appendChild(this.nextButton);

        this.audioPlayer = document.createElement('audio');
        this.audioPlayer.classList.add('rw__music-player__audio-player')
        this.audioPlayer.preload = "metadata"
        this.audioPlayer.addEventListener('loadeddata', this.preLoadMusic);
        // this.audioPlayer.src = this.currentMusic.getSrc();
        // this.currentMusic.setDuration(this.audioPlayer.duration)

        console.log('this.currentMusic => ', this.currentMusic);

        // this.audioPlayer.src = this.musicList[0].getSrc();

        this.seek = document.createElement('div')
        this.seek.classList.add('rw__music-player__seek')

        this.bullet = document.createElement('div')
        this.bullet.classList.add('rw__music-player__seek__bullet')

        this.line = document.createElement('div')
        this.line.classList.add('rw__music-player__seek__line')

        this.seek.appendChild(this.bullet)
        this.seek.appendChild(this.line)

        this.controlButtonsTwo = document.createElement('div')
        this.controlButtonsTwo.classList.add('rw__music-player__control-buttons--two')

        this.shuffleButton = document.createElement('div')
        this.shuffleButton.classList.add('rw__music-player__control-buttons__shuffel-btn')
        this.shuffleButton.innerHTML = `<button><i class="fas fa-random"></i></button>`
        this.shuffleButton.addEventListener('click', this.shuffleMusicListFunc)

        this.repeatButton = document.createElement('div')
        this.repeatButton.classList.add('rw__music-player__control-buttons__repeat-btn')
        this.repeatButton.innerHTML = `<button><i class="fas fa-retweet"></i></button>`
        this.repeatButton.addEventListener('click', this.repeatMusicFunc)

        this.likeButton = document.createElement('div')
        this.likeButton.classList.add('rw__music-player__control-buttons__like-btn')
        this.likeButton.innerHTML = `<button><i class="far fa-heart"></i></button>`
        this.likeButton.addEventListener('click', this.clickOnLikeButton)

        this.controlButtonsTwo.appendChild(this.shuffleButton)
        this.controlButtonsTwo.appendChild(this.repeatButton)
        this.controlButtonsTwo.appendChild(this.likeButton)


        const musicListEl = document.createElement('div')
        musicListEl.classList.add('rw__music-player__music-list')

        for (let musicItem of this.musicList) {
            const musicListItemEl = document.createElement('div')
            musicListItemEl.classList.add('rw__music-player__music-list__item')
            musicListItemEl.setAttribute('data-id', musicItem.getId())

            const musicListItemElThumbnail = document.createElement('div');
            musicListItemElThumbnail.classList.add('rw__music-player__music-list__item__image')
            const musicListItemElThumbnailImg = document.createElement('img')
            musicListItemElThumbnailImg.src = musicItem.getPosterUrl();
            musicListItemElThumbnail.appendChild(musicListItemElThumbnailImg)

            const musicListItemDescription = document.createElement('div');
            musicListItemDescription.classList.add('rw__music-player__music-list__item__description')
            const musicListItemDescriptionTitle = document.createElement('h4');
            musicListItemDescriptionTitle.innerText = musicItem.getTitle()
            const musicListItemDescriptionSubTitle = document.createElement('span');
            musicListItemDescriptionSubTitle.innerText = musicItem.getDescription();
            musicListItemDescription.appendChild(musicListItemDescriptionTitle);
            musicListItemDescription.appendChild(musicListItemDescriptionSubTitle);

            musicListItemEl.appendChild(musicListItemElThumbnail)
            musicListItemEl.appendChild(musicListItemDescription)
            musicListEl.appendChild(musicListItemEl)

            musicListItemEl.addEventListener('click', this.musicListItemElClicked)
        }



        this.musicPlayerEl.appendChild(this.poster);
        this.musicPlayerEl.appendChild(this.title);
        this.musicPlayerEl.appendChild(this.description);
        this.musicPlayerEl.appendChild(this.controlButtonsOne);
        this.musicPlayerEl.appendChild(this.audioPlayer);
        this.musicPlayerEl.appendChild(this.seek);
        this.musicPlayerEl.appendChild(this.controlButtonsTwo);
        this.musicPlayerEl.appendChild(musicListEl);

        this.seek.addEventListener('click', this.clickOnSeekOrLine)
        this.bullet.addEventListener('mousedown', () => {
            this.addMouseMoveEvent();
            this.removeEventsToBullet();
        })

        this.wrapElemnt?.appendChild(this.musicPlayerEl)
    }

    // in this method we get clientX percent to set music duration
    public getBulletOrLineElementClientXPercent = (event: MouseEvent): number => {
        if (this.seek) {
            const seekOffsetLeft = this.seek.getBoundingClientRect().left;
            const elemntClientX = event.clientX - seekOffsetLeft;
            const seekOffsetWidth = this.seek.offsetWidth;

            return (elemntClientX * 100) / seekOffsetWidth;
        }
        return 0;
    }

    private setBulletAndLineBaseOnAudioCurrentTimeAndDuration = (currentTime: number, duration: number): void => {
        const percent = `${(currentTime * 100) / Math.floor(duration)}%`;
        if (this.bullet) this.bullet.style.left = percent;
        if (this.line) this.line.style.width = percent;
    }

    private getCurrentTimeBaseOnPercentAndDuration = (percent: number): { duration: number, currentTime: number } => {
        if (this.audioPlayer) {
            const currentTimeBasePercent =
                percent > 0 ? (percent * this.audioPlayer.duration) / 100 : 0;
            return {
                duration: this.audioPlayer.duration,
                currentTime: currentTimeBasePercent,
            };
        }

        return {
            duration: 0,
            currentTime: 0,
        };
    }

    private setCurrentAudioTimeBaseOnClientXPercent = (percent: number): void => {
        if (this.audioPlayer) {
            const currentTimeAndDuration = this.getCurrentTimeBaseOnPercentAndDuration(
                percent
            );
            this.audioPlayer.currentTime = currentTimeAndDuration.currentTime;
            this.currentTime = currentTimeAndDuration.currentTime;
            this.setBulletAndLineBaseOnAudioCurrentTimeAndDuration(
                currentTimeAndDuration.currentTime,
                currentTimeAndDuration.duration
            );
        }
    }

    private mouseMoveFunc = (event: any): void => {
        if (this.seek) {
            const seekOffsetLeft = this.seek.getBoundingClientRect().left;
            if (
                (event.type === "touchmove" &&
                    event.touches[0].clientX >= seekOffsetLeft &&
                    event.touches[0].clientX - seekOffsetLeft <= this.seek.offsetWidth) ||
                (event.clientX >= seekOffsetLeft &&
                    event.clientX - seekOffsetLeft <= this.seek.offsetWidth)
            ) {
                const bulletClientXPercent = this.getBulletOrLineElementClientXPercent(event)
                this.setCurrentAudioTimeBaseOnClientXPercent(bulletClientXPercent);
            }
        }

    }

    private addMouseMoveEvent = (): void => {
        document.addEventListener('mousemove', this.mouseMoveFunc)
    }

    private removeMouseMoveEvent = (): void => {
        document.removeEventListener('mousemove', this.mouseMoveFunc)
    }

    private removeEventsToBullet = (): void => {
        document.addEventListener('mouseup', () => this.removeMouseMoveEvent())
    }

    private setTimerToCountUpToDuration = (): void => {
        this.timer = setInterval(() => {
            if (this.currentTime < this.currentMusic.getDuration()) {
                if (!this.isDragging) {
                    this.setBulletAndLineBaseOnAudioCurrentTimeAndDuration(
                        this.currentTime,
                        this.currentMusic.getDuration()
                    );
                }
                this.currentTime++;
            } else if (this.loopIsOn) {
                // console.log('we are here');
                this.currentTime = 0;
                this.clearTimerToCountUpToDuration();
                this.setTimerToCountUpToDuration();
            } else {
                this.goToNextMusic()
            }
        }, 1000);
    }

    private clearTimerToCountUpToDuration = (): void => {
        if (this.timer) clearInterval(this.timer);
    }

    public playMusic = (): void => {
        this.isPlay = true;
        if (this.audioPlayer && this.currentTime === 0) {
            this.audioPlayer.src = this.currentMusic.getSrc()
            this.audioPlayer.play();
        } else {
            this.audioPlayer.play();
            this.setTimerToCountUpToDuration();
        }

        this.showPauseButton(true)
    }

    private showPauseButton = (status: boolean) => {
        if (status) {
            this.playButton.style.display = 'none'
            this.pauseButton.style.display = 'inline-block'
            return;
        }
        this.playButton.style.display = 'inline-block'
        this.pauseButton.style.display = 'none'
    }

    public pauseMusic = (): void => {
        this.isPlay = false;
        this.audioPlayer.pause();
        this.clearTimerToCountUpToDuration();
        this.showPauseButton(false)
    }

    private clickOnSeekOrLine = (event: MouseEvent): void => {
        const seekClientXPercent = this.getBulletOrLineElementClientXPercent(event);
        this.setCurrentAudioTimeBaseOnClientXPercent(seekClientXPercent);
    }

    private addActiveClassToMusicListItem = (element: HTMLElement): HTMLElement => {
        if ((element.nodeName === 'IMG' || element.nodeName === 'H4' || element.nodeName === 'SPAN') &&
            element.parentElement && element.parentElement.parentElement)
            element = element.parentElement.parentElement;

        if (element.className === 'rw__music-player__music-list__item__description' && element.parentElement)
            element = element.parentElement;

        element.classList.add('active')
        return element;
    }

    private removeActiveClassFromMusicListItems = (): void => {
        const elements = document.querySelectorAll('.rw__music-player__music-list__item')
        for (let elemnt of Array.from(elements)) {
            if ((elemnt as HTMLElement).classList.contains('active')) {
                (elemnt as HTMLElement).classList.remove('active')
            }
        }
    }

    private musicListItemElClicked = (event: MouseEvent): void => {
        this.removeActiveClassFromMusicListItems();
        const currentElemnt = this.addActiveClassToMusicListItem(event.target as HTMLElement)
        this.resetMusicPlayer();
        const musicIndex = this.findMusicIndexById(currentElemnt.getAttribute('data-id'));
        this.currentMusic = this.musicList[musicIndex];
        this.setMusicInfoToMusicPlayer();
        this.playMusic()
    }

    private findMusicIndexById(id: string | null): number {
        if (this.isShuffle) {
            return id ? this.shuffleMusicList.findIndex((music: Music) => music.getId() === id) : 0
        }
        return id ? this.musicList.findIndex((music: Music) => music.getId() === id) : 0
    }
    private findNextMusicIndex = (currentMusic: Music): number => {
        const currentMusicIndex = this.findMusicIndexById(currentMusic.getId());
        let nextMusicIndex = currentMusicIndex + 1;
        if (currentMusicIndex > -1 && nextMusicIndex < this.musicList.length) {
            return nextMusicIndex;
        }
        return 0
    }

    private findPreviousMusicIndex = (currentMusic: Music): number => {
        const currentMusicIndex = this.findMusicIndexById(currentMusic.getId());
        let previousMusicIndex = currentMusicIndex - 1;
        if (previousMusicIndex >= 0) {
            return previousMusicIndex;
        }
        return this.musicList.length - 1
    }

    private resetMusicPlayer = (): void => {
        this.isPlay = false;
        this.clearTimerToCountUpToDuration();
        this.setCurrentAudioTimeBaseOnClientXPercent(0)
    }

    private setMusicInfoToMusicPlayer = () => {
        this.posterImage.setAttribute('src', this.currentMusic.getPosterUrl());
        this.title.innerText = this.currentMusic.getTitle()
        this.description.innerText = this.currentMusic.getDescription();
    }

    private goToNextMusic = (): void => {
        this.resetMusicPlayer();
        const nextMusicIndex = this.findNextMusicIndex(this.currentMusic);
        this.currentMusic = this.isShuffle ? this.shuffleMusicList[nextMusicIndex] : this.musicList[nextMusicIndex];
        this.setMusicInfoToMusicPlayer();
        this.playMusic()
    }

    private goToPreviousMusic = (): void => {
        this.resetMusicPlayer();
        const previousMusicIndex = this.findPreviousMusicIndex(this.currentMusic);
        this.currentMusic = this.isShuffle ? this.shuffleMusicList[previousMusicIndex] : this.musicList[previousMusicIndex];
        this.setMusicInfoToMusicPlayer();
        this.playMusic()
    }

    private preLoadMusic = (event: Event) => {
        this.currentMusic.setDuration(this.audioPlayer.duration - 2.5)
        this.setTimerToCountUpToDuration();
    }

    private shuffle(array: Array<any>) {
        let newArray = [...array];
        let currentIndex = array.length, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [newArray[currentIndex], newArray[randomIndex]] = [
                newArray[randomIndex], newArray[currentIndex]];
        }
        return newArray;
    }

    private shuffleMusicListFunc = (event: MouseEvent): void => {
        const target = (event.target as HTMLElement);
        let element: HTMLElement;

        if (!(target.nodeName === "I" && target.parentElement)) return;
        element = target.parentElement;

        if (!this.isShuffle) {
            this.isShuffle = true
            this.shuffleMusicList = this.shuffle(this.musicList);
            element.classList.add('active');
            return;
        }

        this.isShuffle = false;
        element.classList.remove('active');
    }

    private repeatMusicFunc = (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        let element: HTMLElement;
        if (!(target.nodeName === 'I' && target.parentElement)) return;
        element = target.parentElement;

        if (!this.loopIsOn) {
            this.loopIsOn = true;
            this.audioPlayer.loop = true;
            element.classList.add('active')
            return;
        }

        this.loopIsOn = false;
        this.audioPlayer.loop = false;
        element.classList.remove('active');
    }

    private clickOnLikeButton = (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        let element: HTMLElement;
        if (!(target.nodeName === 'I' && target.parentElement)) return;
        element = target.parentElement;
        
        if (!this.currentMusic.getLike()) {
            this.currentMusic.setLike(true)
            element.classList.add('active')
            if (this.onLikeFunction) this.onLikeFunction()
            return;
        }

        this.currentMusic.setLike(false);
        element.classList.remove('active')
        if (this.onDislikeFunction) this.onDislikeFunction();

    }
}
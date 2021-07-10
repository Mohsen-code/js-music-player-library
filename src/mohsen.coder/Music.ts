import { v4 as uuidv4 } from 'uuid';

export class Music {
    private id: string = uuidv4().toString().replace(/-/gm, '');
    private title: string = "";
    private description: string = "";
    private src: string = "";
    private posterUrl: string = "";
    private duration: number = 0;
    private liked: boolean = false;

    constructor(data?: object) {
        if (data) Object.assign(this, data);
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setSrc(src: string): void {
        this.src = src;
    }

    public setPosterUrl(posterUrl: string): void {
        this.posterUrl = posterUrl;
    }

    public setDuration(duration: number): void {
        this.duration = duration;
    }

    public setLike(isLike: boolean): void {
        this.liked = isLike
    }

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getDescription(): string {
        return this.description;
    }

    public getSrc(): string {
        return this.src;
    }

    public getPosterUrl(): string {
        return this.posterUrl;
    }

    public getDuration(): number {
        return this.duration;
    }
    
    public getLike(): boolean {
        return this.liked;
    }
}
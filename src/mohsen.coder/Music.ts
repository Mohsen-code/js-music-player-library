export class Music {
    private title: string = "";
    private description: string = "";
    private posterUrl: string = ""
    private duration: number = 0;

    public setTitle(title: string): void {
        this.title = title;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setPosterUrl(posterUrl: string): void {
        this.posterUrl = posterUrl;
    }

    public setDuration(duration: number): void {
        this.duration = duration;
    }

    public getTitle(): string {
        return this.title;
    }

    public getDescription(): string {
        return this.description;
    }

    public getPosterUrl(): string {
        return this.posterUrl;
    }
    
    public getDuration(): number {
        return this.duration;
    }
}
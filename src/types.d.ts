export type TWeatherRecord = {
    id: number,
    date_time?: string,
    temperature: number,
    weather?: string,
    author?: string,
    comment?: string
}

export type TCreateWeatherRecord = {
    date_time?: Date;
    temperature: number;
    weather?: string;
    author?: string;
    comment?: string;
}
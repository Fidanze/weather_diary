import type { TWeatherRecord } from '../../types';

const weatherMocks = [
    'Солнечно',
    'Облачно',
    'Дождь',
    'Град',
    'Снег'
]


export const authorMocks = [
    'Александр',
    'Евгений',
    'Филипп',
    'Анатолий',
    'Артём'
]

let startId = 1
export const createId = () => {
    return startId++
}

export const weatherRecordMocks: TWeatherRecord[] = [
    {
        id: createId(),
        date_time: '09.11.2024 03:30',
        temperature: -33,
        weather: weatherMocks[0],
        author: authorMocks[2],
        comment: ''
    },
    {
        id: createId(),
        date_time: '10.05.2024 02:03',
        temperature: 23,
        weather: weatherMocks[1],
        author: authorMocks[0],
        comment: 'Тестовый комментарий номер 1'
    },
    {
        id: createId(),
        date_time: '11.03.2024 02:00',
        temperature: 0,
        weather: weatherMocks[2],
        author: authorMocks[4],
        comment: 'Тестовый комментарий номер 2'
    },
    {
        id: createId(),
        date_time: '17.01.2024 03:00',
        temperature: 15,
        weather: weatherMocks[3],
        author: authorMocks[2],
        comment: ''
    },
];
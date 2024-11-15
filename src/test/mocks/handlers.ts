import { http, HttpResponse } from 'msw'
import { TWeatherRecord } from '../../types'
import { authorMocks, createId, weatherRecordMocks } from './mockData'
import { format } from 'date-fns'

const allRecords: Map<number, TWeatherRecord> = new Map(
    Object.values(weatherRecordMocks).map((val) => [val.id, val])
)


export const handlers = [
    http.get('/records', () => {
        return HttpResponse.json(Array.from(allRecords.values()))
    }),
    http.post('/records', async ({ request }) => {
        const newRecord = await request.json()
        if (!newRecord) {
            return HttpResponse.json({ status: 400 })
        }
        const typedNewRecord = newRecord as {
            date_time?: string
            temperature: number
            weather?: string
            author?: string
            comment?: string
        }
        const id = createId()
        allRecords.set(id, {
            id: id,
            date_time: typedNewRecord.date_time ? format(typedNewRecord.date_time, 'dd.MM.yyyy hh:mm') : undefined,
            temperature: typedNewRecord.temperature,
            weather: typedNewRecord.weather,
            author: typedNewRecord.author,
            comment: typedNewRecord.comment
        })
        return HttpResponse.json(allRecords.get(id), { status: 201 })
    }),
    http.delete('/records/:id', ({ params }) => {
        const { id } = params
        if (allRecords.delete(parseInt(id as string))) {
            return HttpResponse.json({ id: parseInt(id as string), success: true })
        }
        return HttpResponse.json({ id: parseInt(id as string), success: false })
    }),
    http.get('/authors', () => {
        return HttpResponse.json(authorMocks)
    }),
]
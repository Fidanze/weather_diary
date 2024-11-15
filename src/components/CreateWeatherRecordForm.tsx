import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { RefObject } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAddWeatherRecordMutation, useGetAuthorsQuery } from '../api/apiSlice';
import { TCreateWeatherRecord } from '../types';
import styles from './CreateWeatherRecordForm.module.scss';


const weather = [
    'Солнечно',
    'Облачно',
    'Дождь',
    'Град',
    'Снег'
]

export default function CreateWeatherRecordForm(
    params: { closeModal: () => void, toast: RefObject<Toast> }
) {
    const [addWeatherRecord] = useAddWeatherRecordMutation()

    const onSubmit: SubmitHandler<TCreateWeatherRecord> = (data: TCreateWeatherRecord) => {
        addWeatherRecord(data)
            .unwrap()
            .then(res => {
                params.toast.current?.show({
                    severity: 'success',
                    summary: 'Успешно!',
                    detail: `Запись ${res.id} создана`,
                    life: 3000,
                });
            })
            .catch(error => {
                console.error(error)
                params.toast.current?.show({
                    severity: 'error',
                    summary: 'Ошибка!',
                    detail: 'Не удалось создать новую запись',
                    life: 3000,
                });
            })
            .finally(() => params.closeModal())
    }

    const form = useForm<TCreateWeatherRecord>()

    const { data: authors, isFetching, isError, error } = useGetAuthorsQuery()

    if (isFetching) return <p>Загрузка...</p>;
    if (isError) return <p>{JSON.stringify(error)}</p>;
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.CreateForm}>
            <div className={styles.FloatLabel}>
                <label htmlFor="date_time" >Дата и время</label>
                <Controller
                    name="date_time"
                    control={form.control}
                    render={({ field }) => (
                        <Calendar
                            inputId="date_time"
                            showIcon
                            showTime
                            hourFormat="24"
                            dateFormat="dd.mm.yy"
                            value={field.value}
                            onChange={field.onChange}
                            showButtonBar
                        />
                    )}
                >
                </Controller>
            </div>
            <div className={styles.FloatLabel}>
                <label htmlFor="temperature" >Температура</label>
                <Controller
                    name='temperature'
                    control={form.control}
                    rules={{ required: true, min: -49.99, max: 59.99 }}
                    render={({ field, fieldState }) => (
                        <>
                            <InputNumber
                                inputId="temperature"
                                value={field.value}
                                onChange={e => field.onChange(e.value)}
                                onBlur={field.onBlur}
                                maxFractionDigits={2}
                                suffix=" ℃"
                            />
                            {fieldState.error?.type === 'required' && <Message severity="error" text="Данные по температуре обязательны для заполнения" />}
                            {fieldState.error?.type === 'min' && <Message severity="error" text="Значение температуры должно быть больше -50" />}
                            {fieldState.error?.type === 'max' && <Message severity="error" text="Значение температуры должно быть меньше 60" />}
                        </>
                    )}
                />
            </div>
            <div className={styles.FloatLabel}>
                <label htmlFor="weather" >Погода</label>
                <Controller
                    name='weather'
                    control={form.control}
                    render={({ field }) => (
                        <Dropdown
                            showClear
                            inputId="weather"
                            {...field}
                            options={weather.map(v => ({ optionLabel: v, optionValue: v }))}
                            optionLabel="optionLabel"
                        />
                    )}
                />
            </div>
            <div className={styles.FloatLabel}>
                <label htmlFor="author" >Кто заполнил</label>
                <Controller
                    name='author'
                    control={form.control}
                    render={({ field }) => (
                        <Dropdown
                            showClear
                            inputId="author"
                            {...field}
                            options={authors?.map(v => ({ optionLabel: v, optionValue: v })) || []}
                            optionLabel="optionLabel"
                        />
                    )}
                />
            </div>
            <div className={styles.FloatLabel}>
                <label htmlFor="comment" >Комментарий</label>
                <Controller
                    name='comment'
                    control={form.control}
                    render={({ field }) => (
                        <InputTextarea
                            id="comment"
                            {...field}
                        />
                    )}
                />
            </div>

            <div className={styles.Footer}>
                <Button
                    label="Отмена"
                    icon="pi pi-times"
                    type='button'
                    outlined
                    onClick={params.closeModal}
                />
                <Button
                    label='Создать'
                    type='submit'
                />
            </div>
        </form >
    );
}

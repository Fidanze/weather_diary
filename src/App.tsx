import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Fragment, RefObject, useCallback, useRef, useState } from 'react';
import styles from './App.module.scss';
import { useDeleteWeatherRecordMutation, useGetWeatherRecordsQuery } from './api/apiSlice';
import CreateWeatherRecordForm from './components/CreateWeatherRecordForm';
import { TWeatherRecord } from './types';


export default function App() {
  const { data: weatherRecords, isError, isLoading, error } = useGetWeatherRecordsQuery()

  const [deleteWeatherRecord] = useDeleteWeatherRecordMutation()

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)

  const [selectedWeatherRecord, setSelectedWeatherRecord] = useState<TWeatherRecord | null>(null)

  const toast: RefObject<Toast> | null = useRef(null);

  const deleteSelectedRecord = useCallback(() => {
    if (selectedWeatherRecord) {
      deleteWeatherRecord(selectedWeatherRecord.id)
        .unwrap()
        .then(res => {
          if (res.success) {
            toast.current?.show({
              severity: 'success',
              summary: 'Успешно!',
              detail: ' Запись удалена',
              life: 3000,
            });
          } else {
            toast.current?.show({
              severity: 'error',
              summary: 'Ошибка!',
              detail: ' Не удалось удалить запись',
              life: 3000,
            });
          }
        })
        .catch(error => {
          console.log(error)
          toast.current?.show({
            severity: 'error',
            summary: 'Ошибка!',
            detail: ' Не удалось удалить запись',
            life: 3000,
          });
        })
        .finally(() => setDeleteDialogOpen(false))
    }
  }, [deleteWeatherRecord, selectedWeatherRecord])

  const cancelDeleteRecord = () => {
    setSelectedWeatherRecord(null)
    setDeleteDialogOpen(false);
  }

  const deleteWeatherRecordDialogFooter = (
    <Fragment>
      <Button
        label="Нет"
        icon="pi pi-times"
        outlined
        onClick={cancelDeleteRecord}
      />
      <Button
        label="Да"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedRecord}
      />
    </Fragment>
  );

  const confirmDeleteRecord = (weatherRecord: TWeatherRecord) => {
    setSelectedWeatherRecord(weatherRecord)
    setDeleteDialogOpen(true);
  };

  const deleteButton = (rowData: TWeatherRecord) => (
    <Button
      icon="pi pi-trash"
      rounded
      outlined
      severity="danger"
      onClick={() => confirmDeleteRecord(rowData)}
    />
  )

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>{JSON.stringify(error)}</p>;

  return (
    <div className={styles.App}>

      <div className={styles.Header}>
        <h1>Дневник наблюдения за погодой</h1>
        <Button
          className={styles.AddButton}
          label="Добавить запись"
          icon="pi pi-plus"
          severity="success"
          onClick={() => setCreateDialogOpen(true)}
        />
      </div>

      <DataTable
        value={weatherRecords}
        className={styles.Table}
      >
        <Column field="date_time" header="Дата и время"></Column>
        <Column field="temperature" header="Температура"></Column>
        <Column field="weather" header="Погода"></Column>
        <Column field="author" header="Кто заполнил"></Column>
        <Column field="comment" header="Комментарий"></Column>
        <Column body={deleteButton} exportable={false}></Column>
      </DataTable>

      <Dialog
        visible={isDeleteDialogOpen}
        style={{ width: '32rem', background: 'pink' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        className="p-fluid"
        header="Подтверждение удаления"
        modal
        footer={deleteWeatherRecordDialogFooter}
        onHide={cancelDeleteRecord}
      >
        <div className={styles.DeleteComfirmation}>
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {<span>Вы уверены что хотите удалить эту запись?</span>}
        </div>
      </Dialog >

      <Dialog
        visible={isCreateDialogOpen}
        style={{ width: '32rem', background: 'pink' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Новая запись"
        modal
        onHide={() => setCreateDialogOpen(false)}
      >
        <CreateWeatherRecordForm
          closeModal={() => setCreateDialogOpen(false)}
          toast={toast}
        />
      </Dialog >

      <Toast ref={toast} />
    </div>
  );
}

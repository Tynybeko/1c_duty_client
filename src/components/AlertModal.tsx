import React, { useEffect, useState } from 'react'
import API from '../axios';
import Loading from './Loading';


interface ModalAlertProps {
    onClose: () => void;
    id: string,
    title: string
}

export default function AlertModal({ onClose, id, title }: ModalAlertProps) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any[] | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        setLoading(true)
        API.get('/credit', {
            params: {
                id
            }
        })
            .then(res => setData(res.data.data.credit))
            .catch(err => setError(err?.response?.message ?? 'Ошибка при получении!'))
            .finally(() => setLoading(false))
    }, [])


    return (
        <div onClick={onClose} id="readProductModal" aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">

            <div onClick={(e) => e.stopPropagation()} className="relative p-4 w-full max-w-xl h-full md:h-auto">
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between mb-4 rounded-t sm:mb-5">
                        <div className="text-lg text-gray-900 md:text-xl dark:text-white">
                            <h3 className="font-semibold ">
                                {loading && <Loading />}
                                {
                                    error || title
                                }
                            </h3>
                        </div>
                        <div>
                            <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="readProductModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                    </div>
                    <dl>
                        <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Остатки</dt>
                        {
                            data && !!data.length &&
                            data.map(item => (
                                <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{item.ostatok}</dd>
                            ))
                        }
                        {
                            data && !data.length ?
                                <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400"> Нету</dd>
                                : null

                        }
                    </dl>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                        </div>
                        <button onClick={onClose} type="button" className=" inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}



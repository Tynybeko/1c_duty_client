import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import API from '../axios'
import AlertModal from '../components/AlertModal'


export default function Home() {
    const [loading, setLoaging] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [data, setData] = useState<any[] | null>(null)
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [searchInput, setSearchInput] = useState('')
    const [changeUser, setChangeUser] = useState<null | { [key: string]: any }>(null)
    useEffect(() => {
        const token = Cookies.get('authToken')
        if (!token) {
            navigate('/login')
        }
        setLoaging(true)
        setError('')
        API.get('/list')
            .then(data => {
                setData(data.data?.data?.clients)
                setError('')
            })
            .catch(error => setError(error?.response?.message ?? "Ошибка при получении"))
            .finally(() => setLoaging(false))
    }, [])

    useEffect(() => {
        if (searchInput.length && data) {
            return setFilteredData(data.filter(item => item.name.toLowerCase().includes(searchInput.toLowerCase().trim())))
        }
        setFilteredData([])
    }, [searchInput])

    const logout = () => {
        Cookies.remove('authToken')
        navigate('/login')
    }



    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 min-h-screen">
            {
                changeUser && <AlertModal title={changeUser.name} id={changeUser.id ?? ''} onClose={() => setChangeUser(null)} />
            }
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="w-full md:w-1/2">
                            <form className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">Search</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <input onChange={(e) => setSearchInput(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required />
                                </div>
                            </form>
                           
                        </div>
                        <button onClick={logout}  type="button" className="flex items-center justify-center gap-3 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                Выйти
                            </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Название</th>
                                    <th scope="col" className="px-4 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data && !!filteredData.length && filteredData.map(item => (
                                        <tr className="border-b dark:border-gray-700">
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.name}</th>
                                            <td className="px-4 py-3 flex items-center justify-end">
                                                <button onClick={() => setChangeUser(item)} type="button" className="flex items-center justify-center gap-3 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                                    Запросить долг
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    data && !filteredData.length ?
                                        <tr className="border-b dark:border-gray-700">
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">Введите данные клиента...</th>
                                        </tr>
                                        :
                                        null
                                }
                                {
                                    error.length ?
                                        <tr className="border-b dark:border-gray-700">
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{error}&#34;</th>
                                        </tr> :
                                        null
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}

import axios from 'axios'
import CodeErr from '../constants'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

console.log(process.env)

const CustomAxios = axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
})

const toCamelCase: any = (object: any) => {
    let transformedObject = object
    if (typeof object === 'object' && object !== null) {
        if (object instanceof Array) {
            transformedObject = object.map(toCamelCase)
        } else {
            transformedObject = {}
            for (const key in object) {
                if (object[key] !== undefined) {
                    const newKey = key.replace(/(_\w)|(-\w)/g, (k) => k[1].toUpperCase())
                    transformedObject[newKey] = toCamelCase(object[key])
                }
            }
        }
    }
    return transformedObject
}

export const toSnackCase: any = (object: any) => {
    let transformedObject = object
    if (typeof object === 'object' && object !== null) {
        if (object instanceof Array) {
            transformedObject = object.map(toSnackCase)
        } else {
            transformedObject = {}
            for (const key in object) {
                if (object[key] !== undefined) {
                    const newKey = key
                        .replace(/\.?([A-Z]+)/g, function (_, y) {
                            return '_' + y.toLowerCase()
                        })
                        .replace(/^_/, '')
                    transformedObject[newKey] = toSnackCase(object[key])
                }
            }
        }
    }
    return transformedObject
}

CustomAxios.interceptors.response.use(
    (response) => {
        response.data = toCamelCase(response.data)
        console.log(response.data)
        const { code } = response.data
        if (!code) {
            return response.data
        }
        switch (code) {
            case 401:
            case 403:
            case 404:
            case 405:
            case 407:
                localStorage.removeItem('token')
                toast.error(CodeErr[code]);
                const navigate = useNavigate();
                navigate('/');
                break;
            default:
                toast.error(CodeErr[code]);
                break;
        }
    },
    (error) => {
        return Promise.reject(error)
    }
)

CustomAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) { 
        // 判断是否存在 token, 如果存在的话, 则每个 http header 都加上 token
            config.headers.token = token;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default CustomAxios

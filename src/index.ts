/*

main.js
import { AxiosInit }    from 'dora.axios'
import { UserModule }   from '@/stores/modles/user'
AxiosInit(router, UserModule, 'http://wx.nieba.cn:9001', Element.Message)

*/

import axios from 'axios'

export function AxiosInit(router: any, userModule: any, baseURL: string, message: any, timeout: number = 5000) {
    let Qs = require('qs')

    axios.defaults.baseURL = baseURL
    axios.defaults.timeout = timeout

    let isLogin = Boolean(userModule.token)
    if (isLogin) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userModule.token}`;
    }

    axios.interceptors.request.use(
        config => {
            if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
                config.headers.common['Content-Type'] = 'application/json';

                if (config.data.isRaw) {
                    config.data = config.data.model
                }
                else {
                    config.data = Qs.stringify(config.data)
                }
            } else if (config.method === 'delete') {

            }
            return config
        }, error => {
            return Promise.reject(error)
        })

    axios.interceptors.response.use(
        response => {
            console.log('%c Axios Request Success:', 'color: #4CAF50; font-weight: bold', response);
            return response
        },
        error => {
            console.log('%c Axios Request Error:', 'color: #EC6060; font-weight: bold', error);
            let msg = '';
            if (error.response) {
                switch (error.response.status) {
                    case 401: {
                        router.replace('/clear')
                        break;
                    }
                    default: {
                        msg = error.response.data
                    }
                }
            } else if (error.request) {
                msg = `${error.message}`;
            } else {
                msg = `${error.message}`;
            }

            message.error(msg)
            return Promise.reject(error)
        }
    )
}

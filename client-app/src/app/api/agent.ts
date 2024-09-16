import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity } from '../models/activity';
import { toast } from 'react-toastify';
import { router } from '../router/Router';
import { store } from '../stores/store';

const sleep = (delay: number) =>{
    return new Promise((resolve) =>{
        setTimeout(resolve,delay);
    })
}
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.interceptors.response.use(async res => {    
    await sleep(1000);
    return res;
},(e: AxiosError) =>{
    const {data, status, config } = e.response as AxiosResponse;
    switch(status){
        //Bad request
        case 400:
            if(config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')){
                router.navigate('/not-found');
            }
            if(data.errors){
                const modelStateErrors= [];
                for(const key in data.errors){
                    if (data.errors[key]) 
                        modelStateErrors.push(data.errors[key])                    
                }
                throw modelStateErrors.flat();
            }
            else{
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            //Not Found
            router.navigate('/not-found');
            break;
        case 500:
            //server error
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(e);
});

const responseBody= <T> (response : AxiosResponse<T>) => response.data;

const request={
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body:{}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body:{}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    list:() => request.get<Activity[]>('/activities'), 
    details: (id: string) => request.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post<void>(`/activities`,activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;
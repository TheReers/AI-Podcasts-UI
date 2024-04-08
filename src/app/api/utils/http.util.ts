import axios, { AxiosError, ResponseType } from "axios"

class Http {

    private async makeRequest<Req, Res>({
        url, method, headers, body, responseType
    }: {
        url: string,
        method: 'post' | 'get' | 'put' | 'delete',
        body?: Req,
        headers?: { [key: string]: string },
        responseType?: ResponseType
    }){
        try {
            const request = await axios.request<Res>({
                method, url, data: body, headers: headers || {}, responseType
            })
    
            const { data } = request
    
            return { data }
        } catch (err: any) {
            let error
            err = err as AxiosError
            if (err.response) {
                error = err.response?.data
            } else if (err.request) {
                error = err.request
            } else {
                error = err
            }
    
            return { error }
        }
    }

    async post<Req, Res>(
        url: string, body: Req, headers?: { [key: string]: string }, responseType?: ResponseType
    ) {
        return this.makeRequest<Req, Res>({ url, method: 'post', body, headers, responseType })
    }

    async get<Req, Res>(
        url: string, headers?: { [key: string]: string }, responseType?: ResponseType
    ) {
        return this.makeRequest<Req, Res>({ url, method: 'get', headers, responseType })
    }

    async put<Req, Res>(
        url: string, body: Req, headers?: { [key: string]: string }, responseType?: ResponseType
    ) {
        return this.makeRequest<Req, Res>({ url, method: 'put', body, headers, responseType })
    }

    async delete<Req, Res>(
        url: string, headers?: { [key: string]: string }, responseType?: ResponseType
    ) {
        return this.makeRequest<Req, Res>({ url, method: 'delete', headers, responseType })
    }
}

const http = new Http()
export default http

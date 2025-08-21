import { IResponse } from "../types/api.interfaces";

export const getClearResponse = () : IResponse => {
    const response: IResponse = {
        meta: {
            id: 0
        },
        data: {
            code: null,
            type: null,
            timeouted: false,
            time: 0,
            message: null
        }
    }
    return response
}
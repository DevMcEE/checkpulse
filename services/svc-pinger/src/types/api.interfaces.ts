import z from "zod";
import { HostType } from "./host.types";

export interface IMetaData{
    id: number
}

export interface IData {
    code: number | null,
    type: string | null,
    timeouted: boolean,
    time: number,
    message: string | null
}

export interface IResponse {
    meta: IMetaData,
    data: IData
}

export interface ISchemeProps {
    scheme: z.ZodString,
    hostType: HostType
}
import {IDivision} from "@/models/Division";

export interface IUser {
    id?: number;
    email?: string,
    division?: IDivision,
    name: string,
    begin_date: Date,
    end_date?: Date
    roles: any[];
}
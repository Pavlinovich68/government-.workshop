import {Division} from "@/models/Division";

export interface User {
   id?: number;
   email?: string,
   division?: Division,
   name: string,
   begin_date: Date,
   end_date?: Date
   roles: any;
}
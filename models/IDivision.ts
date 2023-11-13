export interface IDivision {
   id?: number;
   name?: string;
   short_name?: string;
   contacts?: string;
   childrens?: IDivision[];
}
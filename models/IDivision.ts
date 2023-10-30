export interface IDivision {
    id: number;
    name: string;
    short_name: string;
    childrens: IDivision[];
}
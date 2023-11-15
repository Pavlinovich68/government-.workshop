export interface IDataSourceResult {
   status: number;
   recordCount: number;
   pageCount: number;
   pageNo: number;
   pageSize: number;
   result: any[];
}
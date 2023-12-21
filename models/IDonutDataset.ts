export interface IDonutDataset {
   day: number,
   data: {
      datasets: IDonutDatasetItem[]
   }
}

export interface IDonutDatasetItem {
   data: number[],
   backgroundColor: []
}
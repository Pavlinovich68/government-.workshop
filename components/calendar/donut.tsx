import {Chart} from "primereact/chart";
import { classNames } from "primereact/utils";
import {useEffect, useState} from "react";
import styles from "./styles.module.scss";

const ItrDonut = ({data, year, month, day}: any) => {
   const [chartData, setChartData] = useState({});
   const [chartOptions, setChartOptions] = useState({});

   useEffect(() => {
      const options = {
            cutout: '85%',
            borderWidth: ''
      };
      setChartData(data);
      setChartOptions(options);
   }, [data, year, month, day]);

   return (
      <Chart data-year={year} data-month={month} data-day={day} type="doughnut" className={classNames(styles.eventsDonut)} data={chartData} options={chartOptions} style={{width: "60px"}} />
   );
}

export default ItrDonut;
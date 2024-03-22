"use client";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
   scales,
   Colors,
} from "chart.js";
import { Bar, Chart } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import Header from "../../_components/header";
import { useTheme } from "next-themes";
ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

type Props = {
   positionName: string;
   labels: string[];
   dataSet: number[];
};

const BarGraphContainer = ({ positionName, labels, dataSet }: Props) => {
   const { theme } = useTheme()
 
   ChartJS.defaults.color= theme === "dark" ? "#fff" :"#000"
   

   const options = {
      indexAxis: "y" as const,
      elements: {
         bar: {
            borderWidth: 2,
         },
      },
      responsive: true,
      plugins: {
         legend: {
            position: "right" as const,
            
         },
      },
      scales: {
         x: {
            ticks: {
               font: (context:any) => {
                  const width = context.chart.width || 0;
                  return {
                      size: width < 600 ? 12 : 17, 
                  };
              },
            },
         },
         y: {
            ticks: {
               font: (context:any) => {
                  const width = context.chart.width || 0;
                  console.log(width)
                  return {
                      size: width < 600 ? 12 : 17, 
                  };
              },
            },
         },
      },
   };

   const data = {
      labels,
      datasets: [
         {
            label: "Total Votes",
            data: dataSet,
            borderColor: "rgb(21, 128, 61)",
            backgroundColor: "rgb(34, 197, 94)",
         },
      ],
   };
   return (
      <div className="w-full">
         <div className="text-center">
            <Header text={positionName}></Header>
         </div>
         <Bar options={options} data={data} />
      </div>
   );
};

export default BarGraphContainer;

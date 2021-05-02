import { observer } from "mobx-react-lite";
import { Line } from "react-chartjs-2";
import { AllSensorsRecordsStore } from "../../../store/AllSensorsRecords";
import { ChartContainer } from "./ChartContainer";

const chartOptions = {
    legend: {
        labels: {
            usePointStyle: false,
        },
    },
    animation: {
        duration: 0, // general animation time
    },
    hover: {
        animationDuration: 0, // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0, // animation duration after a resize
    // aspectRatio: 1,
    responsiveAnimation: false,
    maintainAspectRatio: false,
    elements: {
        point: {
            radius: 0,
        },
        line: {
            tension: 0,
            borderWidth: 1,
            spanGaps: true,
            showLine: false,
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                distribution: "linear",
                spanGaps: true,
                time: {
                    displayFormats: {
                        millisecond	: "H-mm-ss",
                        second	    : "H-mm-ss",
                        minute	    : "H-mm",
                        hour	    : "H-mm",
                    },
                },
            },
        ],
        yAxes: [
            {
                ticks: {
                    suggestedMax: 100,
                    min: 20
                },
            },
        ],
    },
};

export const RecordsVisualization = observer( () => (
    <ChartContainer>
        <Line
            data={ {
                datasets: AllSensorsRecordsStore.recordSets.map(
                    ( { label, color, records } ) => ( {
                        label,
                        borderColor: color,
                        data: records,
                        fill: false,
                        pointBorderWidth: 0,
                    } )
                )
            } }
            // @ts-ignore
            options={
                chartOptions
            }
        />
    </ChartContainer>
) );

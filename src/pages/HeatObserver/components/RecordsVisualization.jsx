import { memo } from "react";
import { Line } from "react-chartjs-2";
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

const NotMemorizedRecordsVisualization = ( { data } ) => (
    <ChartContainer>
        <Line
            data={ {
                datasets: [
                    {
                        label: "Текущая температура экструдера °C",
                        borderColor: "rgba(225, 75, 75, 1)",
                        data: data.realTemperatureOfExtruder,
                        fill: false,
                        pointBorderWidth: 0,
                    }, {
                        label: "Ожидаемая температура экструдера °C",
                        borderColor: "rgba(120, 81, 169, 1)",
                        data: data.expectedTemperatureOfExtruder,
                        fill: false,
                        pointBorderWidth: 0,
                    }, {
                        label: "Текущая температура стола °C",
                        borderColor: "rgba(40, 114, 51, 1)",
                        data: data.realTemperatureOfTable,
                        fill: false,
                        pointBorderWidth: 0,
                    }, {
                        label: "Ожидаемая температура стола °C",
                        borderColor: "rgba(0, 0, 0, 1)",
                        data: data.expectedTemperatureOfTable,
                        fill: false,
                        pointBorderWidth: 0,
                    },
                ],
            } }
            // @ts-ignore
            options={
                chartOptions
            }
        />
    </ChartContainer>
);

export const RecordsVisualization = memo( NotMemorizedRecordsVisualization );

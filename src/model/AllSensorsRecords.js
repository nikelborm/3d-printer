import { action, observable } from "mobx";
import { OneSensorRecordsSet } from "./OneSensorRecordsSet";

const RegExpForSearchNumbers = /([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})/g;

export class AllSensorsRecords {
    @observable recordSets = [
        new OneSensorRecordsSet(
            "Текущая температура экструдера °C",
            "rgba(225, 75, 75, 1)",
            "realTemperatureOfExtruder",
        ),
        new OneSensorRecordsSet(
            "Ожидаемая температура экструдера °C",
            "rgba(120, 81, 169, 1)",
            "expectedTemperatureOfExtruder",
        ),
        new OneSensorRecordsSet(
            "Текущая температура стола °C",
            "rgba(40, 114, 51, 1)",
            "realTemperatureOfTable",
        ),
        new OneSensorRecordsSet(
            "Ожидаемая температура стола °C",
            "rgba(0, 0, 0, 1)",
            "expectedTemperatureOfTable"
        ),
    ]
    @action parseTemperatureLineAndArrangeIntoDatasets = ( line, time ) => {
        const temperatures = line.match( RegExpForSearchNumbers );
        const dateObj = new Date( time );
        this.recordSets.forEach(
            ( recordSet, index ) => {
                recordSet.addRecord( {
                    value: parseFloat( temperatures[ index ] ),
                    dateObj
                } );
            }
        );
    };
}

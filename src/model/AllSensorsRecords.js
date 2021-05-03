import { action, makeObservable, observable } from "mobx";
import dayjs from "dayjs";

function getEmptyRecordsArray( length ) {
    return Array.from( { length }, ( elem, index ) => ( {
        y: NaN,
        x: new Date( Date.now() + ( index - length + 1 ) * 1000 )
    } ) );
}

export class OneSensorRecordsSet {
    constructor( label, color, codeName ) {
        this.label = label;
        this.color = color;
        this.codeName = codeName;
        makeObservable( this );
    }
    label;
    color;
    codeName;
    defaultGraphLineLengthInSeconds = 300;
    records = observable.array(
        getEmptyRecordsArray( this.defaultGraphLineLengthInSeconds ),
        { deep: false }
    );
    @action addRecord = ( { value, dateObj } ) => {
        const newRecord = {
            x: dateObj,
            y: value,
        }
        const lastItem = this.records[ this.records.length - 1 ];
        if ( lastItem && dayjs( newRecord.x ).diff( dayjs( lastItem.x ), "seconds" ) > 5 ) {
            this.records.push( { y: NaN, x: lastItem.x } );
            this.records.shift();
        }
        this.records.push( newRecord );
        this.records.shift();
    };
}
const RegExpForSearchNumbers = /([+-]{0,1}[0-9]{1,}[.][0-9]{1,})|([+-]{0,1}[0-9]{1,})/g;

export class AllSensorsRecords {
    recordSets = [
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
    parseTemperatureLineAndArrangeIntoDatasets = ( line, time ) => {
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

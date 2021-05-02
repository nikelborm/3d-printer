import { action, observable } from "mobx";
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

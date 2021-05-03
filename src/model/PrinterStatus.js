import { action, observable, computed, makeObservable } from "mobx";

export class PrinterStatus {
    constructor() {
        makeObservable( this );
    }
    intervalForUpdatingInternalTicker = null;
    timeoutThatStopsUpdatingInternalTicker = null;
    @observable isPrinterConnected = null;
    @observable isPrintingActive = null;
    @observable filePrintingInfo = {
        secondsCost: 0,
        gCodeFileName: "",
        startTime: 0,
        finishTime: 0,
    };
    @observable msNow = 0;
    @action updateInternalTicker = () => {
        this.msNow = Date.now();
    };
    stopUpdatingInternalTicker = () => {
        clearInterval( this.intervalForUpdatingInternalTicker );
        clearTimeout( this.timeoutThatStopsUpdatingInternalTicker );
        this.intervalForUpdatingInternalTicker = null;
        this.timeoutThatStopsUpdatingInternalTicker = null;
    }
    @action startUpdatingInternalTicker = () => {
        this.updateInternalTicker();
        this.intervalForUpdatingInternalTicker = setInterval(
            () => {
                this.updateInternalTicker();
            },
            500 // Обновлять внутренний счётчик каждые пол секунды
        );
        this.timeoutThatStopsUpdatingInternalTicker = setTimeout(
            () => {
                this.stopUpdatingInternalTicker();
            },
            this.filePrintingInfo.finishTime - Date.now() // миллисекунды до того момента, когда печать закончится
        );
    };
    @computed get remainingTime() { // оставшееся количество миллисекунд
        return this.filePrintingInfo.finishTime - this.msNow;
    }
    @computed get elapsedTime() { // миллисекунд прошло с момента начала печати
        return this.msNow - this.filePrintingInfo.startTime;
    }
    @computed get isPrintingFinished() {
        return this.remainingTime <= 0;
    }
    @computed get canOurCommandsBeDangerous() {
        return this.remainingTime > 0;
    }
    @computed get printingPercentFinished() {
        return ( this.isPrintingFinished
            ? 100
            // this.elapsedTime / 1000 - переводим миллисекунды в секунды
            // * 100 - финальный коэф переводим в проценты
            // так и получаем эту сраную / 10
            : +( this.elapsedTime / this.filePrintingInfo.secondsCost / 10 ).toFixed( 2 )
        );
    }
    @action setActivePrintingStatus = ( {
        secondsCost,
        gCodeFileName,
        startTime,
        finishTime,
    } ) => {
        this.isPrintingActive = true;

        this.filePrintingInfo.secondsCost = secondsCost;
        this.filePrintingInfo.gCodeFileName = gCodeFileName;
        this.filePrintingInfo.startTime = startTime;
        this.filePrintingInfo.finishTime = finishTime;

        this.filePrintingInfo.startTimeDate = new Date( startTime );
        this.filePrintingInfo.finishTimeDate = new Date( finishTime );

        this.stopUpdatingInternalTicker();
        this.startUpdatingInternalTicker();
    };
    @action.bound setInactivePrintingStatus = () => { /* closeProgressBar */
        this.isPrintingActive = false;
        this.stopUpdatingInternalTicker();
    };
    @action setUnknownPrintingStatus = () => {
        this.isPrintingActive = null;
    };
    @action setPrinterConnectionStatus = isConnected => {
        this.isPrinterConnected = isConnected;
    };
    @action setUnknownConnectionStatus = () => {
        this.isPrinterConnected = null;
    };
}

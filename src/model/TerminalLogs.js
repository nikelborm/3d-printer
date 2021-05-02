import { action, observable } from "mobx";

export class TerminalLogs {
    // каждый отдельный терминал лог не планируется изменяться в будущем
    terminalLogs = observable.array( [], { deep: false } );
    maxTerminalLinesCount = 200;
    @action addLineIntoTerminalLogs = lineInfo => {
        this.terminalLogs.unshift( lineInfo );
        if ( this.terminalLogs.length > this.maxTerminalLinesCount ) {
            this.terminalLogs.pop();
        }
    }
    @action addTestSampleInTerminal = () => {
        const sample = [
            {
                time: new Date(),
                name: "client",
                prefixcontent: "_.gcode",
                linecontent: ";FLAVOR:Marlin ;TIME:100 ;TIME:1593 ;Filament used: 1.58554m ;Layer height: 0.16 ;MINX:95.725 ;MINY:95.725 ;MINZ:0.2 ;MAXX:124.275 ;MAXY:124.275 ;MAXZ:19.88 ;Generated with Cura_SteamEngine 4.8.0 M140 S90 M105 M190 S90 M104 S230 M105 M109 S230 M82 ;absolute extrusion mode G28........"
            }, {
                time: new Date( Date.now() - 11000 ),
                name: "connect-success",
                prefixcontent: "printer",
                linecontent: "Принтер подключён"
            }, {
                time: new Date( Date.now() - 22000 ),
                name: "connect-error",
                prefixcontent: "printer",
                linecontent: "Принтер отключён"
            }, {
                time: new Date( Date.now() - 33000 ),
                name: "printer",
                prefixcontent: "printer",
                linecontent: "ok"
            }, {
                time: new Date( Date.now() - 44000 ),
                name: "printer",
                prefixcontent: "printer",
                linecontent: "echo: busy: procesing"
            }, {
                time: new Date( Date.now() - 55000 ),
                name: "printer",
                prefixcontent: "printer",
                linecontent: "echo: busy: procesing"
            }, {
                time: new Date( Date.now() - 66000 ),
                name: "printer",
                prefixcontent: "printer",
                linecontent: "echo: busy: procesing"
            }, {
                time: new Date( Date.now() - 77000 ),
                name: "client",
                prefixcontent: "command",
                linecontent: "G28"
            }, {
                time: new Date( Date.now() - 88000 ),
                prefixcontent: "wserver",
                name: "connect-success",
                linecontent: "Подключение установлено!"
            }, {
                time: new Date( Date.now() - 99000 ),
                prefixcontent: "wserver",
                name: "connect-error",
                linecontent: "Подключение потеряно, переподключение..."
            }, {
                time: new Date( Date.now() - 110000 ),
                prefixcontent: "wserver",
                name: "connect-error",
                linecontent: "Подключение потеряно, переподключение..."
            }
        ];
        this.terminalLogs.unshift( ...sample );
    }
    @action clearTerminalLogs = () => this.terminalLogs.clear();
}

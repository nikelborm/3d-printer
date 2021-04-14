import { Component } from "react";
import { StyledProgressBar } from "./StyledProgressBar";

export class FilePrintingProgressBar extends Component {
    interval = null;
    intervalCleaningTimeout = null;
    startNewInterval = () => {
        this.interval = setInterval( () => {
            this.forceUpdate();
        }, 500 );
        this.intervalCleaningTimeout = setTimeout( () => {
            clearInterval( this.interval );
        }, this.props.finishTime.getTime() - Date.now() + 600 );
    };
    componentDidUpdate( prevProps ) {
        if ( prevProps.startTime.getTime() !== this.props.startTime.getTime() ) {
            this.componentWillUnmount();
            this.startNewInterval();
        }
    }
    componentWillUnmount() {
        clearInterval( this.interval );
        clearTimeout( this.intervalCleaningTimeout );
    }
    componentDidMount() {
        // Это написано с учётом того что он монтируется только когда появляется нижняя полоска
        // А появляется она только в случае, если isPrintingActive === true
        const { finishTime } = this.props;
        const isPrintingFinished = Date.now() >= finishTime.getTime();
        if ( !isPrintingFinished ) this.startNewInterval();
    }
    render() {
        const { isPrintingFinished, startTime, secondsCost } = this.props;
        return (
            <StyledProgressBar
                isPrintingFinished={ isPrintingFinished }
                percent={ isPrintingFinished
                    ? 100
                    : ( ( Date.now() - startTime.getTime() ) / 10 / secondsCost ).toFixed( 2 )
                }
            />
        );
    }
}

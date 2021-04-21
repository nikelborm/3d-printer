import React from "react";

const Loading = () => <h1>Loading...</h1>;

const ShowError = ( { error } ) => (
    <div>
        <h2> { error.name } </h2>
        <p> { error.message } </p>
    </div>
);

export const createPrefetcher = ( {
    importPromise,
    exportKey = "default",
    Fallback = Loading,
    ErrorPresenter = ShowError,
} ) => {
    let globalLoadingResult = { isLoaded: false };
    const moduleRequest = importPromise.then(
        response => {
            return globalLoadingResult = {
                isLoaded: true,
                isSuccessful: true,
                Component: response[ exportKey ]
            };
        },
        error => {
            return globalLoadingResult = {
                isLoaded: true,
                isSuccessful: false,
                error
            };
        },
    );
    return class ComponentPrefetcher extends React.Component {
        state = globalLoadingResult
        componentDidMount() {
            if ( this.state.isLoaded ) return;
            moduleRequest.then(
                result => this.setState( result )
            );
        }
        render() {
            const { isLoaded, isSuccessful, error, Component } = this.state;
            return isLoaded
                ? React.createElement(
                    isSuccessful ? Component : ErrorPresenter,
                    isSuccessful ? { ...this.props } : { error }
                )
                : <Fallback/>;
        }
    }
}

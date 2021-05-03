import { Component } from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { configure }          from "mobx"
import Alert                  from "react-bootstrap/Alert";
import { enableLogging }      from "mobx-logger";
import { AppWSChannel }       from "./AppWSChannel";
import { Login }              from "./pages/Login";
import { createPrefetcher }   from "./components/Prefetcher";
import { PageContentWrapper } from "./components/PageContentWrapper";

enableLogging();

configure( {
    enforceActions: "always",
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: true
} );

const Fallback = () => (
    <PageContentWrapper>
        <h1>Загрузка страницы</h1>
    </PageContentWrapper>
);

const ErrorPresenter = ( { error } ) => (
    <PageContentWrapper>
        <Alert variant="danger">
            <Alert.Heading> Произошла ошибка при загрузке страницы: { error.name } </Alert.Heading>
            { error.message && <p> { error.message } </p> }
        </Alert>
    </PageContentWrapper>
);

const pagePrefetcher = ( page ) => createPrefetcher( {
    importPromise: import( "./pages/" + page ),
    exportKey: page,
    Fallback,
    ErrorPresenter
} );

const AdminRouteContent = pagePrefetcher( "Admin" );

class App extends Component {
    componentDidMount() {
        AppWSChannel.start();
    }
    render() {
        return (
            // <StrictMode>
                <BrowserRouter>
                    <Switch>
                        <Route path="/login/" component={ Login }/>
                        <Route path="/admin/" component={ AdminRouteContent }/>
                        <Route path="*">
                            <Redirect to="/login/"/>
                        </Route>
                    </Switch>
                </BrowserRouter>
            // </StrictMode>
        );
    }
}
export default App;

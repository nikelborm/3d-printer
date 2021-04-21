import { StrictMode } from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import { Login }            from "./pages/Login";
import GlobalWSContext      from "./components/GlobalContextBasedOnDataFromWS";
import { createPrefetcher } from "./components/Prefetcher";
import { PageContent }      from "./components/PageContent";
import Alert                from "react-bootstrap/Alert";

const Fallback = () => (
    <PageContent>
        <h1>Загрузка страницы</h1>
    </PageContent>
);

const ErrorPresenter = ( { error } ) => (
    <PageContent>
        <Alert variant="danger">
            <Alert.Heading> Произошла ошибка при загрузке страницы: { error.name } </Alert.Heading>
            { error.message && <p> { error.message } </p> }
        </Alert>
    </PageContent>
);

const pagePrefetcher = ( page ) => createPrefetcher( {
    importPromise: import( "./pages/" + page ),
    exportKey: page,
    Fallback,
    ErrorPresenter
} );

const AdminRouteContent = pagePrefetcher( "Admin" );

const App = props => (
    <StrictMode>
        <GlobalWSContext>
            <BrowserRouter>
                <Switch>
                    <Route path="/login/" component={ Login }/>
                    <Route path="/admin/" component={ AdminRouteContent }/>

                    <Route path="*">
                        <Redirect to="/login/"/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </GlobalWSContext>
    </StrictMode>
);

export default App;

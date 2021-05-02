import { StrictMode } from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import { Login }            from "./pages/Login";
import { createPrefetcher } from "./components/Prefetcher";
import { PageContentWrapper }      from "./components/PageContentWrapper";
import Alert                from "react-bootstrap/Alert";

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

const App = props => (
    <StrictMode>
        <BrowserRouter>
            <Switch>
                <Route path="/login/" component={ Login }/>
                <Route path="/admin/" component={ AdminRouteContent }/>

                <Route path="*">
                    <Redirect to="/login/"/>
                </Route>
            </Switch>
        </BrowserRouter>
    </StrictMode>
);

export default App;

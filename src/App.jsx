import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import { TerminalRoute }        from "./pages/Terminal";
import { AxesControlRoute }     from "./pages/AxesControl";
import { HeatObserverRoute }    from "./pages/HeatObserver";
import { LoginRoute }           from "./pages/Login";
import { LoadSlicedModelRoute } from "./pages/LoadSlicedModel";

import GlobalContextBasedOnDataFromWS from "./components/GlobalContextBasedOnDataFromWS";
import { MenuWithRouter } from "./components/Menu";
import { FilePrintingStatusBar } from "./components/FilePrintingStatusBar";

const App = props => (
    <React.StrictMode>
        <GlobalContextBasedOnDataFromWS>
            <BrowserRouter>
                <MenuWithRouter/>
                <FilePrintingStatusBar/>
                <Switch>
                    <LoginRoute           path="/login/"                 exact/>
                    <TerminalRoute        path="/admin/terminal/"        exact/>
                    <AxesControlRoute     path="/admin/axesControl/"     exact/>
                    <HeatObserverRoute    path="/admin/heatObserver/"    exact/>
                    <LoadSlicedModelRoute path="/admin/loadSlicedModel/" exact/>
                    <Route path="*">
                        <Redirect to="/login/"/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </GlobalContextBasedOnDataFromWS>
    </React.StrictMode>
);

export default App;

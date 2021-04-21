import { Switch, Route, Redirect } from "react-router-dom";
import { Terminal } from "../Terminal";
import { AxesControl } from "../AxesControl";
import { HeatObserver } from "../HeatObserver";
import { LoadSlicedModel } from "../LoadSlicedModel";

export const Admin = ( ...props ) => {console.log("Admin", ...props);return(
    <Switch>
        <Route path="/admin/terminal/"        exact component={ Terminal }/>
        <Route path="/admin/axesControl/"     exact component={ AxesControl }/>
        <Route path="/admin/heatObserver/"    exact component={ HeatObserver }/>
        <Route path="/admin/loadSlicedModel/" exact component={ LoadSlicedModel }/>

        <Route path="*">
            <Redirect to="/admin/terminal/"/>
        </Route>
    </Switch>
)};

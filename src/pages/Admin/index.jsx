import { Switch, Route, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContentOfTerminalPage } from "../Terminal";
import { ContentOfAxesControlPage } from "../AxesControl";
import { ContentOfHeatObserverPage } from "../HeatObserver";
import { ContentOfLoadSlicedModelPage } from "../LoadSlicedModel";
import { Menu } from "../../components/Menu";
import { FilePrintingStatusBar } from "../../components/FilePrintingStatusBar";
import { PageContentWrapper } from "../../components/PageContentWrapper";
import { AuthInfoStore } from "../../store/AuthManager";
import { observer } from "mobx-react";

export const Admin = observer( () => (
    AuthInfoStore.amIAuthorized
        ? (
            <>
                <Menu/>
                <FilePrintingStatusBar/>
                <PageContentWrapper>
                    <Switch>
                        <Route path="/admin/terminal/"        exact component={ ContentOfTerminalPage }/>
                        <Route path="/admin/axesControl/"     exact component={ ContentOfAxesControlPage }/>
                        <Route path="/admin/heatObserver/"    exact component={ ContentOfHeatObserverPage }/>
                        <Route path="/admin/loadSlicedModel/" exact component={ ContentOfLoadSlicedModelPage }/>

                        <Route path="*">
                            <Redirect to="/admin/terminal/"/>
                        </Route>
                    </Switch>
                </PageContentWrapper>
            </>
        )
        : <Redirect to="/login/" />
    )
);

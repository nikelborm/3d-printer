import React, { useCallback, useContext } from "react";
import { withRouter } from "react-router-dom";
import { GlobalContext } from "../../components/GlobalContextBasedOnDataFromWS";
import { Input } from "./components/Input";
import { Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { DivThatCenterInnerElements } from "./components/DivThatCenterInnerElements";

const Login = () => {
    const {
        authorizationActions: {
            amIAuthorized,
            login
        },
        isAuthInProcess
    } = useContext( GlobalContext );

    const handleSend = useCallback( event => {
        event.preventDefault();
        login( event.target.elements.password.value );
        event.target.elements.password.value = "";
    }, [ login ] );

    if ( amIAuthorized() ) {
        return <Redirect to="/admin/terminal/" />;
    }
    return (
        <DivThatCenterInnerElements>
            <div>
                <h1>Авторизация</h1>
                <Form onSubmit={ handleSend }>
                    <Input
                        type="password"
                        name="password"
                        placeholder="********"
                        label="Введите пароль:"
                    />
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={ isAuthInProcess }
                        children={ isAuthInProcess ? "Вход..." : "Войти" }
                    />
                </Form>
            </div>
        </DivThatCenterInnerElements>
    );
}

export const LoginRoute = withRouter( Login );

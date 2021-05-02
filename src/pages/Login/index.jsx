import { Input } from "./components/Input";
import { Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { DivThatCenterInnerElements } from "./components/DivThatCenterInnerElements";
import "./styles.css";
import { AuthInfoStore, login } from "../../store/AuthManager";
import { observer } from "mobx-react-lite";

const handleSend = event => {
    event.preventDefault();
    const passwordInput = event.target.elements.password;
    login( passwordInput.value );
    passwordInput.value = "";
};

export const Login = observer( () => (
    AuthInfoStore.amIAuthorized
        ? <Redirect to="/admin/terminal/" />
        : (
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
                            disabled={ AuthInfoStore.isAuthInProcess }
                            children={ AuthInfoStore.isAuthInProcess ? "Вход..." : "Войти" }
                        />
                    </Form>
                </div>
            </DivThatCenterInnerElements>
        )
) );

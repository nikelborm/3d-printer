export const reportAuthStatus = ( connection, isPasswordCorrect, password, authType ) => connection.send(
    JSON.stringify( {
        event: authType + "Reply",
        report: {
            isError: !isPasswordCorrect,
            info: isPasswordCorrect ? "" : "Неверный пароль",
        },
        reply: {
            password: password,
        },
    } )
);

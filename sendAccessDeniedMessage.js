export const sendAccessDeniedMessage = ( connection, replyFor ) => connection.send(
    JSON.stringify( {
        event: replyFor + "Reply",
        report: {
            isError: true,
            info: "У вас нет прав для выполнения данной операции.",
        },
    } )
);

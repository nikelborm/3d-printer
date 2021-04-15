import { log } from "./log.js";

function isCorrect( field ) {
    return typeof field === "string" && !!field.length;
}

export function validateInput( input ) {
    let isOK = false;
    let body;
    let info = "";
    const bodystring = input.toString();
    try {
        body = JSON.parse( bodystring );
        if ( typeof body === "object" /* other checks */ ) {
            isOK = true;
            log( "В сокет пришло: ", body );
        } else {
            info = "Некорректная структура запроса: " + bodystring;
            log( "Некорректная структура запроса: ", body );
        }
        // if ( !isCorrect( body.command ) ) {
        //     info = "Вы не ввели G команду.";
        // }
    } catch ( error ) {
        info = "Ошибка при парсинге JSON запроса: " + bodystring;
        log( info );
        log( "error: ", error );
    }
    return { isOK, info, body };
}

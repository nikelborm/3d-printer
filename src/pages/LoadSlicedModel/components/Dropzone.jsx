import { useDropzone } from "react-dropzone";
import { useCallback, memo } from "react";
import { DropBoxContainer } from "./DropBoxContainer";

function NotMemorizedDropzone( { sender, canOurCommandsBeDangerous, isPrinterConnected } ) {
    const onDrop = useCallback( acceptedFiles => {
        if ( canOurCommandsBeDangerous ) {
            alert( "Дождитесь завершения печати!" );
            return;
        }
        if ( !isPrinterConnected ) {
            alert( "Вы не можете загружать файлы до установки подключения с принтером." );
            return;
        }
        const file = acceptedFiles[ 0 ];
        if ( !(/\.(g|gcode)$/ ).test( file.name ) ) { // подстраховочка к input accept
            alert( `Файл недопустим к отправке, потому что имеет расширение отличное от .code
Имя файла: ${ file.name }
Тип файла: ${ file.type }` );
            return;
        }
        const reader = new FileReader();
        reader.onabort = () => console.log( "file reading was aborted" );
        reader.onerror = () => console.log( "file reading has failed" );
        reader.onload = () => {
            sender( reader.result, file.name );
        };
        reader.readAsText( file );
    }, [ sender, canOurCommandsBeDangerous, isPrinterConnected ] );

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone( { multiple: false, onDrop } );

    return (
        <div className="container">
            <DropBoxContainer {...getRootProps( { isDragActive } ) }>
                <input accept=".g, .gcode" {...getInputProps() } />
                Перетащите .gcode файл в эту область или <br/>
                нажмите на неё, чтобы выбрать файл для загрузки
            </DropBoxContainer>
        </div>
    );
}

export const Dropzone = memo( NotMemorizedDropzone );

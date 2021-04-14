const RenderedWarning = <>
    <p>
        Помимо G команд вы можете ввести:
    </p>
    <ol>
        <li><code>test</code> для вывода тестового набора строк в терминал</li>
        <li><code>clear</code> для очистки терминала</li>
        <li><code>resetfile</code> для экстренного завершения печати файла</li>
    </ol>
    <p>
        Помните: ваши команды могут привести к непоправивым последствиям. <br/>
        Пишите, только, если уверены в том, к чему это приведёт. <br/>
    </p>
</>;

export const AlternateCommandsAndIssuesWarning = () => RenderedWarning;

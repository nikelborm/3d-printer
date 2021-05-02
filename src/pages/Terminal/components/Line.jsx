import { memo } from "react";
import {
    DefaultPrefixBorder,
    DefaultPrefixContent,
    PrefixBorders,
    PrefixContents,
    DefaultDivider,
    Dividers,
    DefaultLineContent,
    LineContents,
} from "./LinePartsDefinitions";


function ComponentChooser( defaultVariant, switchObject, key ) {
    return key in switchObject ? switchObject[ key ] : defaultVariant;
}

function createPrefix( name, content, opener, closer ) {
    const Border  = ComponentChooser( DefaultPrefixBorder,  PrefixBorders,  name );
    const Content = ComponentChooser( DefaultPrefixContent, PrefixContents, name );
    return <span>
        <Border>
            { opener }
        </Border>
        <Content>
            { content }
        </Content>
        <Border>
            { closer }
        </Border>
    </span>;
}

function createDivider( content, name ) {
    const InlineDivider = ComponentChooser( DefaultDivider, Dividers, name );
    return <InlineDivider>
        { content }
    </InlineDivider>;
}

function createLineContent( content, name ) {
    const LineContent = ComponentChooser( DefaultLineContent, LineContents, name );
    return <LineContent>
        { content }
    </LineContent>;
}

function NotMemorizedLine( { time, name, prefixcontent, linecontent } ) {
    return <div>
        { createPrefix( "time", time.toLocaleString(), "[ ", "" ) }
        { createDivider( ", " ) }
        { createPrefix( name, prefixcontent, "", " ]" ) }
        { createDivider( " - " ) }
        { createLineContent( linecontent, name ) }
    </div>;
}

export const Line = memo( NotMemorizedLine );

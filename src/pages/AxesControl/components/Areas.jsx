import areasInfo from "./areasInfo.json";

const RenderedAreas = areasInfo.map( info => (
    <area
        target=""
        key={ info.command }
        alt={ info.command }
        title={ info.command }
        href=""
        coords={ info.coords }
        shape={ info.shape }
    />
) );

export const Areas = () => <>{ RenderedAreas }</>;

import { SVGProps } from "react";

const VIEWBOX24 = '0 0 24 24';

export const IconPlus = (props: SVGProps<SVGSVGElement>) => 
    (<svg {...props} viewBox={VIEWBOX24}><use xlinkHref='/__spritemap#sprite-plus'></use></svg>);

export const IconMinus = (props: SVGProps<SVGSVGElement>) => 
    (<svg {...props} viewBox={VIEWBOX24}><use xlinkHref='/__spritemap#sprite-minus'></use></svg>);

export const IconChevronUp = (props: SVGProps<SVGSVGElement>) =>
    (<svg {...props} viewBox={VIEWBOX24}><use xlinkHref='/__spritemap#sprite-chevron-up'></use></svg>);

export const IconLogout = (props: SVGProps<SVGSVGElement>) =>
    (<svg {...props} viewBox={VIEWBOX24}><use xlinkHref='/__spritemap#sprite-logout'></use></svg>);

export const IconCheckupList = (props: SVGProps<SVGSVGElement>) =>
    (<svg {...props} viewBox={VIEWBOX24}><use xlinkHref='/__spritemap#sprite-checkup-list'></use></svg>);

export const IconPlugConnectedX = (props: SVGProps<SVGSVGElement>) =>
    (<svg {...props} viewBox={VIEWBOX24}><use xlinkHref='/__spritemap#sprite-plug-connected-x'></use></svg>);

export const IconCloud = (props: SVGProps<SVGSVGElement>) =>
    (<svg {...props} viewBox={VIEWBOX24}><use xlinkHref='/__spritemap#sprite-cloud'></use></svg>);

export const IconInfoCircle = (props: SVGProps<SVGSVGElement>) =>
    (<svg {...props} viewBox={VIEWBOX24}><use xlinkHref='/__spritemap#sprite-info-circle'></use></svg>);

export const IconAlertTriangle = (props: SVGProps<SVGSVGElement>) =>
    (<svg {...props} viewBox={VIEWBOX24}><use xlinkHref='/__spritemap#sprite-alert-triangle'></use></svg>);
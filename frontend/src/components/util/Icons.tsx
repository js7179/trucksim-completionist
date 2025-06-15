import { SVGProps } from "react";

export const IconPlus = (props: SVGProps<SVGSVGElement>) => 
    (<svg {...props}><use xlinkHref='/__spritemap#sprite-plus'></use></svg>);

export const IconMinus = (props: SVGProps<SVGSVGElement>) => 
    (<svg {...props}><use xlinkHref='/__spritemap#sprite-minus'></use></svg>);

export const IconChevronUp = (props: SVGProps<SVGSVGElement>) =>
    (<svg {...props}><use xlinkHref='/__spritemap#sprite-chevron-up'></use></svg>)
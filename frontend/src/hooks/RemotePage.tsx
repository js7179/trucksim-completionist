import { PropsWithChildren } from "react";
import { RemotePage, RemotePageContext } from "./RemotePageContext";

export const RemotePageProvider = ({game, uid, children}: PropsWithChildren<RemotePage>) => {
    return (
        <RemotePageContext.Provider value={{game: game, uid: uid}}>
            {children}
        </RemotePageContext.Provider>
    );
}
import { PropsWithChildren, createContext, useContext } from "react";
import { RemoteComponentContext } from "./ComponentContext";

type RemotePage = {
    game: string;
    uid: string;
}

export const RemotePageContext = createContext<RemotePage>({} as RemotePage);

export const RemotePageProvider = ({game, uid, children}: PropsWithChildren<RemotePage>) => {
    return (
        <RemoteComponentContext>
            <RemotePageContext.Provider value={{game: game, uid: uid}}>
                {children}
            </RemotePageContext.Provider>
        </RemoteComponentContext>
    );
}

export function useRemotePage() {
    return useContext(RemotePageContext);
}
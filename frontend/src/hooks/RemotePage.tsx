import { PropsWithChildren, createContext, useContext } from "react";

type RemotePage = {
    game: string;
    uid: string;
}

export const RemotePageContext = createContext<RemotePage>({} as RemotePage);

export const RemotePageProvider = ({game, uid, children}: PropsWithChildren<RemotePage>) => {
    return (
        <RemotePageContext.Provider value={{game: game, uid: uid}}>
            {children}
        </RemotePageContext.Provider>
    );
}

export function useRemotePage() {
    return useContext(RemotePageContext);
}
import { createContext, useContext } from "react";

export type RemotePage = {
    game: string;
    uid: string;
}

export const RemotePageContext = createContext<RemotePage>({} as RemotePage);

export function useRemotePage() {
    return useContext(RemotePageContext);
}
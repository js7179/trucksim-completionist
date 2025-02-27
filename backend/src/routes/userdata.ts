// "/:uid/:game"
import express, { Request, Response } from 'express';
import { UUID } from "crypto";
import { SavedataManager } from '@/data/savedata-manager';
import gameInfo from '@/data/gameinfo';
import { UserSavedataCache } from '@/data/cache';
import { AchievementStateList, performStateUpdate } from 'trucksim-completionist-common';

const userSavedataRouter = express.Router({
    mergeParams: true
});

interface RouteParams {
    uid: UUID;
    game: string;
}

const userdataRouter = (savedataManager: SavedataManager, savedataCache: UserSavedataCache) => {
    userSavedataRouter.get('/', async (req: Request<RouteParams>, res: Response) => {
        const { uid, game } = req.params;
        if(!uid || !game) {
            res.sendStatus(400);
            return;
        }
        if(!gameInfo.isValidGame(game)) {
            res.status(404).send(`Invalid game "${game}"`);
            return;
        }
        /*if(res.locals.uuid !== uid) {
            res.status(403).send('Forbidden');
            return;
        }*/

        let savedata: AchievementStateList;
        if(savedataCache.hasUserSavedataCached(uid, game)) {
            savedata = savedataCache.getUserSavedata(uid, game)!;
        } else {
            try {
                savedata = await savedataManager.rebuildSavedata(uid, game);
                savedataCache.setUserSavedata(uid, game, savedata);
            } catch(err) {
                res.sendStatus(503);
                return;
            }
        }
        res.status(200).json(savedata);
    });
    
    userSavedataRouter.post('/', async (req: Request<RouteParams>, res: Response) => {
        const { uid, game } = req.params;
        if(!uid || !game) {
            res.status(400).send('Bad Request');
            return;
        }
        if(!gameInfo.isValidGame(game)) {
            res.status(404).send(`Invalid game "${game}"`);
            return;
        }
        /*if(res.locals.uuid !== uid) {
            res.status(403).send('Forbidden');
            return;
        }*/

        let savedata: AchievementStateList;
        if(savedataCache.hasUserSavedataCached(uid, game)) {
            savedata = savedataCache.getUserSavedata(uid, game)!;
        } else {
            try {
                savedata = await savedataManager.rebuildSavedata(uid, game);
            } catch (err) {
                res.sendStatus(503);
                return;
            }
        }
        try {
            const action = req.body;
            const { newState, rowsChanged } = performStateUpdate(savedata, gameInfo.getGameAchInfo(game), action);
            savedataCache.setUserSavedata(uid, game, newState);
            if(rowsChanged.length === 0) {
                res.sendStatus(304);
                return;
            } else {
                savedataManager.applyChanges(uid, game, newState, rowsChanged);
            }
            res.status(200).json(newState);
        } catch (err) {
            res.sendStatus(503);
            return;
        }
    });

    userSavedataRouter.put('/', (req, res) => res.sendStatus(405));
    userSavedataRouter.patch('/', (req, res) => res.sendStatus(405));
    userSavedataRouter.delete('/', (req, res) => res.sendStatus(405));
    return userSavedataRouter;
};

export default userdataRouter;
// "/:uid/:game"
import express, { Request, Response } from 'express';
import { UUID } from "crypto";
import { SavedataManager } from '@/data/savedata-manager';
import { GameInfo } from '@/data/gameinfo';
import { UserSavedataCache } from '@/data/cache';
import { AchievementStateList, performStateUpdate } from 'trucksim-completionist-common';
import { StateUpdateError } from 'trucksim-completionist-common/src/state';

const userSavedataRouter = express.Router({
    mergeParams: true
});

interface RouteParams {
    uid: UUID;
    game: string;
}

const userdataRouter = (savedataManager: SavedataManager, gameInfo: GameInfo, savedataCache: UserSavedataCache) => {
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
        if(res.locals.uuid !== uid) {
            res.status(403).send('Forbidden');
            return;
        }

        let savedata: AchievementStateList;
        if(savedataCache.hasUserSavedataCached(uid, game)) {
            savedata = savedataCache.getUserSavedata(uid, game)!;
        } else {
            try {
                savedata = await savedataManager.rebuildSavedata(uid, game);
                savedataCache.setUserSavedata(uid, game, savedata);
            } catch(err) {
                console.error(err);
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
        if(res.locals.uuid !== uid) {
            res.status(403).send('Forbidden');
            return;
        }

        let savedata: AchievementStateList;
        if(savedataCache.hasUserSavedataCached(uid, game)) {
            savedata = savedataCache.getUserSavedata(uid, game)!;
        } else {
            try {
                savedata = await savedataManager.rebuildSavedata(uid, game);
            } catch (err) {
                console.error(err);
                res.sendStatus(503);
                return;
            }
        }
        try {
            const action = req.body;
            const { newState, rowsChanged } = performStateUpdate(savedata, gameInfo.getGameAchInfo(game), action);
            if(rowsChanged.length === 0) {
                res.sendStatus(204);
                return;
            }
            savedataManager.applyChanges(uid, game, newState, rowsChanged);
            // Only apply changes to the cache if saving to DAO successful
            savedataCache.setUserSavedata(uid, game, newState);
            
            res.status(200).json(newState);
        } catch (err) {
            if(err instanceof StateUpdateError) {
                res.status(400).json({ message: err.message });
                return;
            } else {
                res.sendStatus(503);
                return;
            }
        }
    });

    userSavedataRouter.put('/', (req, res) => res.sendStatus(405));
    userSavedataRouter.patch('/', (req, res) => res.sendStatus(405));
    userSavedataRouter.delete('/', (req, res) => res.sendStatus(405));
    return userSavedataRouter;
};

export default userdataRouter;
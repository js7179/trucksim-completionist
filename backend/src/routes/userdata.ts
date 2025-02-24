// "/:uid/:game"
import express, { Request, Response } from 'express';
import { UUID } from "crypto";
import { SavedataRebuilder } from '@/data/savedata-rebuilder';
import gameInfo from '@/data/gameinfo';

const userSavedataRouter = express.Router({
    mergeParams: true
});

interface RouteParams {
    uid: UUID;
    game: string;
}

const userdataRouter = (savedataRebuider: SavedataRebuilder) => {
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

        const userSavedata = await savedataRebuider.rebuildSavedata(uid, game);

        res.status(200);
        res.json(userSavedata);
    });
    
    userSavedataRouter.patch('/', async (req: Request<RouteParams>, res: Response) => {
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
        res.sendStatus(200);
    });

    userSavedataRouter.put('/', (req, res) => res.sendStatus(405));
    userSavedataRouter.post('/', (req, res) => res.sendStatus(405));
    
    return userSavedataRouter;
};

export default userdataRouter;
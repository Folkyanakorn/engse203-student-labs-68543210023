import { Router } from 'express';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = process.env.DB_FILE ?? path.resolve(HERE, '../../data/campus.db');
const router = Router();

router.get('/' , (req , res) => {
    const db = new DatabaseSync(DB_FILE);
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
});

router.get('/:id/requests' , (req , res) => {
    const db = new DatabaseSync(DB_FILE);
    const requests = db.prepare('SELECT * FROM requests WHERE requester_id = ?').all(req.params.id);
    res.json(requests);
}); 

export default router;
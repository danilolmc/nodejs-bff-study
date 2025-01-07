import express, { Request, Response } from 'express';
import cors from 'cors';
import { log } from 'console';
const app = express();

app.use(cors({
    origin: [
        String(process.env.BFF_MOBILE_ORIGIN),
    ],
}));

async function getPosts(limit = '100', skip = '0') {
    const API = process.env.API_URL;
    const data = await fetch(`${API}?limit=${limit}&skip=${skip}`);
    const posts = await data.json();
    log(posts)
    return posts;
}

app.get('/posts', async (req: Request, res: Response) => {
    const limit = req.query.limit ? String(req.query.limit) : undefined;
    const skip = req.query.skip ? String(req.query.skip) : undefined;

    try {
        const posts = await getPosts(limit, skip);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        res.status(500).json({ error: 'Erro ao buscar os posts. Tente novamente mais tarde.' });
    }
});


app.listen(3000, async () => {
    console.log('Server is running on port 3000');

})
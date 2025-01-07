import { log } from 'console';
import cors from 'cors';
import express, { Request, Response } from 'express';

const app = express();

app.use(cors({
    origin: [
        JSON.parse(String(process.env.ALLOWED_CLIENTS_ORIGIN)),
    ],
}));


log(JSON.parse(String(process.env.ALLOWED_CLIENTS_ORIGIN)))

async function getAuthor(userId: number) {
    const API = process.env.USER_API_URL;
    const data = await fetch(`${API}/${userId}`);
    const result = await data.json();

    return {
        id: result.id,
        firstName: result.firstName,
        age: result.age,
        gender: result.gender,
        username: result.username,
    };
}

async function getPosts(limit = 20, skip = 0) {
    const API = process.env.POSTS_SERVICE_URL;
    const data = await fetch(`${API}?limit=${limit}&skip=${skip}`);
    const result = await data.json();


    const posts = result?.posts?.map(async (post: any) => {
        return getAuthor(post.userId).then((author) => {
            return {
                id: post.id,
                title: post.title,
                body: post.body,
                tags: post.tags,
                reactions: post.reactions,
                views: post.views,
                author,
            }
        })
    })

    result.posts = await Promise.all(posts);

    return result;
}

async function* paginator(limit = 20, _page = 1) {

    let page = _page;

    while (true) {
        const skip = (page - 1) * limit
        const data = await getPosts(limit, skip);

        const pages = Math.ceil(data?.total / limit);

        if (!data?.posts?.length) break;

        yield {
            posts: data.posts,
            page,
            pages,
            hasMore: page < pages,
            total: data.total
        };
        page += 1
    }
}

app.get('/', async (req: Request, res: Response) => {

    try {
        const page = req.query.page ? Number(req.query.page) : undefined;
        const limit = req.query.limit ? Number(req.query.limit) : undefined;

        const data = paginator(limit, page);

        const posts = await data.next();

        res.json(posts.value);

    } catch (error) {
        log('Erro ao buscar posts:', error);
    }

});


app.listen(3001, async () => {
    console.log('Server is running on port 3001');
})
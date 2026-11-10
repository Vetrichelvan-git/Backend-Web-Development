/**
 * Post Repository (In-Memory Array Implementation)
 *
 * Future Prisma Implementation Transition:
 *
 * What will change:
 * 1. Storage Backend: The in-memory array and manual nextId counter will be replaced
 *    with a database table managed by Prisma Client (e.g., prisma.post).
 * 2. Asynchronous Operations: Repository methods will become async and return Promises
 *    (e.g., async findAll() { return await prisma.post.findMany(); }) since database I/O is asynchronous.
 * 3. Query Execution:
 *    - findAll() -> prisma.post.findMany()
 *    - findById(id) -> prisma.post.findUnique({ where: { id: Number(id) } })
 *    - create(fields) -> prisma.post.create({ data: fields })
 *    - update(id, patch) -> prisma.post.update({ where: { id: Number(id) }, data: patch })
 *    - remove(id) -> prisma.post.delete({ where: { id: Number(id) } })
 * 4. Identifier Generation: Handled natively by the database sequence / auto-increment
 *    (@id @default(autoincrement())) instead of an in-memory counter.
 *
 * What will remain unchanged:
 * 1. Repository Contract: The interface method names (findAll, findById, create, update, remove)
 *    and return expectations remain consistent.
 * 2. Service Layer Separation: The business logic in postService (such as title validation,
 *    error status codes, and input preparation) remains untouched and decoupled from storage details.
 * 3. Controllers and API Contract: HTTP status codes (200, 201, 204, 404, 422), response
 *    payload structures ({ data: ... }), and routing are fully preserved.
 */

const initialPosts = [
  { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 },
  { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 },
];

let posts = [...initialPosts.map((post) => ({ ...post }))];
let nextId = 3;

function findAll() {
  return posts.map((post) => ({ ...post }));
}

function findById(id) {
  const post = posts.find((p) => p.id === Number(id));
  return post ? { ...post } : null;
}

function create(fields) {
  const post = {
    id: nextId++,
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
  };
  posts.push(post);
  return { ...post };
}

function update(id, patch) {
  const post = posts.find((p) => p.id === Number(id));
  if (!post) return null;
  if (patch.title !== undefined) post.title = patch.title;
  if (patch.body !== undefined) post.body = patch.body;
  if (patch.authorId !== undefined) post.authorId = patch.authorId;
  return { ...post };
}

function remove(id) {
  const index = posts.findIndex((p) => p.id === Number(id));
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};

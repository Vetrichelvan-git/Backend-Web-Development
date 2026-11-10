/**
 * Post Repository (In-Memory Map Implementation)
 *
 * Demonstrates the Storage-Swap Proof:
 * Internal storage was swapped from an array-backed store to a Map-backed store
 * without requiring any modifications to postService or postController.
 *
 * Future Prisma Implementation Transition:
 *
 * What will change:
 * 1. Storage Backend: The in-memory Map and local nextId counter will be replaced
 *    with a persistent relational database managed by Prisma Client (e.g., prisma.post).
 * 2. Asynchronous Operations: Repository operations will become asynchronous and return
 *    Promises (e.g., async findAll() { return await prisma.post.findMany(); }) because
 *    database I/O operations are asynchronous.
 * 3. Query Execution:
 *    - findAll() -> prisma.post.findMany()
 *    - findById(id) -> prisma.post.findUnique({ where: { id: Number(id) } })
 *    - create(fields) -> prisma.post.create({ data: fields })
 *    - update(id, patch) -> prisma.post.update({ where: { id: Number(id) }, data: patch })
 *    - remove(id) -> prisma.post.delete({ where: { id: Number(id) } })
 * 4. Identifier Generation: Handled natively by the database sequence / auto-increment
 *    (@id @default(autoincrement())) instead of an in-memory counter.
 * 5. Connection Lifecycle: PrismaClient connection lifecycle management (connect, disconnect).
 *
 * What will remain unchanged:
 * 1. Repository Contract: The public interface methods (findAll, findById, create, update, remove)
 *    and their input/output contracts remain identical.
 * 2. Service Layer Decoupling: The business logic in postService (such as required title validation,
 *    HTTP 422 error throwing, and domain workflow orchestration) remains completely decoupled
 *    from storage details and does not need to know about SQL or Prisma-specific query syntax.
 * 3. Controllers and API Contract: HTTP status codes (200, 201, 204, 404, 422), response
 *    payload structures ({ data: ... }), and routing are fully preserved.
 */

const initialPosts = [
  { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 },
  { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 },
];

const posts = new Map(initialPosts.map((post) => [post.id, { ...post }]));
let nextId = 3;

function findAll() {
  return Array.from(posts.values()).map((post) => ({ ...post }));
}

function findById(id) {
  const post = posts.get(Number(id));
  return post ? { ...post } : null;
}

function create(fields) {
  const post = {
    id: nextId++,
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
  };
  posts.set(post.id, post);
  return { ...post };
}

function update(id, patch) {
  const numericId = Number(id);
  const post = posts.get(numericId);
  if (!post) return null;
  if (patch.title !== undefined) post.title = patch.title;
  if (patch.body !== undefined) post.body = patch.body;
  if (patch.authorId !== undefined) post.authorId = patch.authorId;
  return { ...post };
}

function remove(id) {
  const numericId = Number(id);
  return posts.delete(numericId);
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};

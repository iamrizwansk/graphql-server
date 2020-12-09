const { gql } = require('apollo-server')

module.exports = gql`
type Comment {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
}
type Like {
    id: ID!
    username: String!
    createdAt: String!
}
type Post {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    commentsCount: Int!
    likesCount: Int!
}
type User {
    username: String!
    token: String!
    email: String!
    createdAt: String!
    id: ID!
}
type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
}
input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
}
type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post
}

`
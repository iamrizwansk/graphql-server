const usersResolvers = require('./usersResolvers')
const postResolvers = require('./postsResolvers')
const commentResolver = require('./commentResolver')

module.exports = {
    Post: {
     commentsCount: (parent) => parent.comments.length,
     likesCount: (parent) => parent.likes.length
    },
    Query: {
     ...postResolvers.Query
    },
    Mutation: {
    ...usersResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolver.Mutation
    }
}
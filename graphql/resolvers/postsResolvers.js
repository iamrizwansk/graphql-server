const { AuthenticationError, UserInputError } = require('apollo-server')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/check-auth')

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({createdAt: -1})
        return posts
      } catch (error) {
        throw new Error(error)
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId)
        if (post) {
          return post
        }
        else {
          throw new AuthenticationError('Post not found')
        }
      } catch (error) {
        throw new Error(error)
      }
    }
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      if (body.trim() === '') {
        throw new Error('Post body should not be empty')
      }
      const user = checkAuth(context)
      const post = await new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      })
      const savePost = post.save()
      
      return savePost
    },

    deletePost: async (_, { postId }, context) => {
    const user = checkAuth(context)
    try {
      const post = await Post.findById(postId)
      if (user.username === post.username) {
        await post.delete()
        return 'Post deleted successfully'
      }else {
        throw new AuthenticationError('Action not allowed')
      }
      
    } catch (error) {
      throw new Error(error)
    }
    
  },
  likePost: async(_, { postId }, context) => {
    const { username } = checkAuth(context)
    const post = await Post.findById(postId)
    if (post) {
      if (post.likes.find(like => like.username === username)) {
         post.likes = post.likes.filter(like => like.username !== username)

      } else {
       post.likes.push({
         username,
         createdAt: new Date().toISOString
       })
      }
      await post.save()
       return post 
    } else throw new UserInputError('Post not found')
}

},

}


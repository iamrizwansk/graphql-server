const User = require('../../models/User')
const { SECRET_KEY } = require('../../config')
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')

const { UserInputError } = require('apollo-server')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            id: user._id,
            username: user.username
        }, SECRET_KEY, { expiresIn: '1h' }
    )
}


module.exports = {
    Mutation: {
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword)
            
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            const user = await User.findOne({ username })
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors:
                        { username: "Username is taken" }
                })
            }

            password = await bcrypt.hash(password, 12)
            const newUser = await new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()


            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }

        },
        async login(_, { username, password }) {
            const { valid, errors } = validateLoginInput(username, password)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            } 
            const user = await User.findOne({ username })
            if (!user) {
                throw new UserInputError('Authentication Error', {
                    errors: {
                        general: 'Authentication Error'
                    }
                })
            }
            const match = await bcrypt.compare(password, user.password)

            
            if (!match) {
                throw new UserInputError('Authentication Error', {
                    errors: {
                        general: 'Authentication Error'
                    }
                })
            }

            const token = generateToken(user)
            
            return {
                ...user._doc,
                id: user._id,
                token
            }

        }
    }
}
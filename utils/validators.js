
module.exports.validateRegisterInput = (username,
    email, 
    password,
    confirmPassword
    ) => {
     const errors = {}
     if (email.trim() === '') {
         errors.email = 'Email should not be empty'
     } else {
         const regEx =  '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'
         if (!email.match(regEx)) {
           errors.email = 'Email should be of proper format'
         }
     }
     if (password === '') {
         errors.password = 'Password should not be empty'
     }
     if (username === '') {
        errors.username = 'Username should not be empty'
    }
    if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match'
    }
 
    return {
        errors,
        valid: Object.keys(errors).length < 1

    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {}
    if (password === '') {
        errors.password = 'Password should not be empty'
    }
    if (username === '') {
       errors.username = 'Username should not be empty'
   }
   return {
    errors,
    valid: Object.keys(errors).length < 1

}
   
}
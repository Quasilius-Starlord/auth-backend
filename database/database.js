const { hashPassword } = require('./../utility/helper')

class Datastore{
    constructor() {
        if (!Datastore.instance) {
            this.users = [];
            Datastore.instance = this;
        }
        return Datastore.instance;
    }

    async addUser({
        name,
        email,
        password,
        // Adding admin field in adding additional feature
        isAdmin = false,
        // profile visibility field in adding additional feature
        profileVisibility = 'public'
    }){
        try {
            const existingUser = this.users.find(user => user.email == email);
            if(existingUser)
                throw new Error('User already exist choose a different name');
            const hashedPassword = await hashPassword(password);
            const newLength=this.users.push({
                name, email,
                hashedPassword,
                isAdmin,
                profileVisibility
            })
            const newUser = {
                name: this.users.at(newLength-1).name,
                email: this.users.at(newLength-1).email,
                isAdmin: this.users.at(newLength-1).isAdmin,
                profileVisibility: this.users.at(newLength-1).profileVisibility
            }
            console.log(this.users);

            return newUser;
        } catch (error) {
            throw error
        }

    }

    async getUser({
        email
    }){
        try {
            const user = this.users.find(user => user.email == email);
            console.log(user);
            if(!user)
                throw new Error('User not found');
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userEmail ,{
        name,
        bio,
        phone,
        photo,
        email,
        password,
        isPublic
    }){
        try {
            const userIndex = this.users.findIndex(user => user.email == userEmail);
            console.log(userIndex);
            if(userIndex == -1)
                throw new Error('User not found');
            if(name)
                this.users.at(userIndex)['name'] = name;
            if(bio)
                this.users.at(userIndex)['bio'] = bio;
            if(phone)
                this.users.at(userIndex)['phone'] = phone;
            if(photo)
                this.users.at(userIndex)['photo'] = photo;
            if(email)
                this.users.at(userIndex)['email'] = email;
            if(isPublic === true){
                this.users.at(userIndex)['profileVisibility'] = 'public';
            }else if(isPublic === false){
                this.users.at(userIndex)['profileVisibility'] = 'private';
            }
            if(password)
                this.users.at(userIndex)['hashedPassword'] = await hashPassword(password)
            return this.users.at(userIndex);
        } catch (error) {
            throw error;
        }
    }
    
    // added check to view all profile by admin and public profile by user as new feature of authetication
    async getAllUsers(userEmail){
        try {
            const user = await this.getUser({email: userEmail});
            let users=[];
            if(user.isAdmin){
                users = this.users.map(user => ({
                    name: user.name,
                    email: user.email
                }));
            } else {
                users = this.users.filter(user => user.profileVisibility === 'public').map(user => ({
                    name: user.name,
                    email: user.email
                }));
            }
            return users;
        } catch (error) {
            throw error;
        }
    }
}

const dataStore = new Datastore();
module.exports = dataStore;
import { usersRepository } from './users.repository.js';
export class UsersService {
    async registerUser(user) {
        return usersRepository.registerUser(user);
    }
    async updateUser(id, updatedFields) {
        return usersRepository.updateUser(id, updatedFields);
    }
    async getAllUsers() {
        return usersRepository.getUsers();
    }
}
export const usersService = new UsersService();

import { usersService } from '../users/users.service.js';
export class AuthService {
    async register(user) {
        return usersService.registerUser(user);
    }
}
export const authService = new AuthService();

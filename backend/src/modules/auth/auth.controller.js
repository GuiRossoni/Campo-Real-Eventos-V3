import { authService } from './auth.service.js';
export class AuthController {
    async handleRegister(req, res) {
        try {
            await authService.register(req.body);
            res.json({ success: true });
        }
        catch (e) {
            res.status(500).json({ success: false, error: e.message });
        }
    }
}
export const authController = new AuthController();

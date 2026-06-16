import { usersService } from './users.service.js';
export class UsersController {
    async handleUpdateUser(req, res) {
        try {
            const { id, updatedFields } = req.body;
            const updated = await usersService.updateUser(id, updatedFields);
            res.json({ success: true, data: updated });
        }
        catch (e) {
            res.status(500).json({ success: false, error: e.message });
        }
    }
    async handleUpdateFinancialSettings(req, res) {
        try {
            const payload = req.body;
            const updated = await usersService.updateFinancialSettings(payload);
            res.json({ success: true, data: updated });
        }
        catch (e) {
            res.status(500).json({ success: false, error: e.message });
        }
    }
}
export const usersController = new UsersController();

import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { userService } from "../services/userService";

export const usersController = {
  watching: async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user!;

    try {
      const watching = await userService.getKeepWatchingList(id);
      return res.json(watching);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  show: async (req: AuthenticatedRequest, res: Response) => {
    const currentUser = req.user!;

    try {
      return res.json(currentUser);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  update: async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user!;
    const { firstName, lastName, phone, email, birth } = req.body;

    try {
      const updatedUser = await userService.update(id, {
        firstName,
        lastName,
        phone,
        email,
        birth,
      });

      return res.json(updatedUser);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  updatePassword: async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Não autorizado!" });
    }

    try {
      user.checkPassword(currentPassword, async (err, isSame) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        if (!isSame) {
          return res.status(400).json({ message: "Senha incorreta" });
        }
      });

      await userService.updatePassword(user.id, newPassword);
      return res.status(204).send();
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};

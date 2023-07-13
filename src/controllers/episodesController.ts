import { Request, Response } from "express";
import { episodeService } from "../services/episodeService";
import { AuthenticatedRequest } from "../middlewares/auth";

export const episodesController = {
  stream: async (req: Request, res: Response) => {
    const { videoUrl } = req.query;
    const range = req.headers.range;

    try {
      if (typeof videoUrl !== "string") {
        throw new Error("videoUrl deve ser do tipo 'string'");
      }

      episodeService.streamEpisodeToResponse(res, videoUrl, range);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getWatchTime: async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const episodeId = req.params.id;

    try {
      const watchTime = await episodeService.getWatchTime(
        userId,
        Number(episodeId)
      );
      return res.json(watchTime);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  setWatchTime: async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const episodeId = Number(req.params.id);
    const { seconds } = req.body;

    try {
      const watchTime = await episodeService.setWatchTime({
        episodeId,
        userId,
        seconds,
      });
      return res.json(watchTime);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};

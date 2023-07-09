import { Request, Response } from "express";
import { episodeService } from "../services/episodeService";

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
};

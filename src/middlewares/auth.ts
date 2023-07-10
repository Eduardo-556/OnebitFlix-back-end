import { NextFunction, Request, Response } from "express";
import { UserInstance } from "../models/User";
import { jwtService } from "../services/jwtService";
import { userService } from "../services/userService";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: UserInstance | null;
}

export function ensureAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const autthorizationHeader = req.headers.authorization;
  if (!autthorizationHeader) {
    return res
      .status(401)
      .json({ message: "Não autorizado: nenhum token encontrado" });
  }
  const token = autthorizationHeader.replace(/Bearer /, "");

  jwtService.verifyToken(token, (err, decoded) => {
    if (err || typeof decoded === "undefined") {
      return res
        .status(401)
        .json({ message: "Não autorizado: token invalido" });
    }

    userService.findByEmail((decoded as JwtPayload).email).then((user) => {
      req.user = user;
      next();
    });
  });
}

export function ensureAuthviaQuery(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { token } = req.query;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Não autorizado: nenhum token encontrado." });
  }
  if (typeof token !== "string") {
    return res
      .status(400)
      .json({ message: "O parâmetro token deve ser do tipo string." });
  }

  jwtService.verifyToken(token, (err, decoded) => {
    if (err || typeof decoded === "undefined") {
      return res
        .status(401)
        .json({ message: "Não autorizado: token inválido." });
    }
    userService.findByEmail((decoded as JwtPayload).email).then((user) => {
      req.user = user;
      next();
    });
  });
}

import { Request, Response, NextFunction }
from "express";

import { supabase } from "../config/supabase";

export const adminMiddleware =
async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const user = (req as any).user;

  const { data } =
    await supabase
      .from("employees")
      .select("role")
      .eq("id", user.id)
      .single();

  if (!data || data.role !== "admin") {

    return res.status(403).json({

      message: "Admin access required"

    });

  }

  next();

};
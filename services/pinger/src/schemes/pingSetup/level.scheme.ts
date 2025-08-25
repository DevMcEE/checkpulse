import z from "zod";
import { Levels } from "../../types/pingSetup.types";

export const levelScheme = z.enum(Levels)

import { SET_SEED } from "./types";

export const setSeed = () => ({
  type: SET_SEED,
  payload: Math.floor(Math.random() * 1001),
});

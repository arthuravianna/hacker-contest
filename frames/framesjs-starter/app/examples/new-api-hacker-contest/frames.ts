/* eslint-disable react/jsx-key */
import { createFrames } from "frames.js/next";

export const frames = createFrames({
  basePath: "/examples/new-api-hacker-contest",
  initialState: {
    pageIndex: 0,
  }
});

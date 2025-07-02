import { nextJsConfig } from "@repo/eslint-config/next-js";
import { reactThreeFiberConfig } from "@repo/eslint-config/react-three-fiber";

/** @type {import("eslint").Linter.Config} */

//Add react three fiber and three.js to the eslint config
export default [
    nextJsConfig,
    reactThreeFiberConfig,
];



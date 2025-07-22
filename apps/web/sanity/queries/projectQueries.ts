import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY =
  defineQuery(`*[_type == "Project" && defined(slug.current)][0...12]{
  ...
}`);

export const CV_QUERY = defineQuery(`*[_type == "cv"][0]{...}`);

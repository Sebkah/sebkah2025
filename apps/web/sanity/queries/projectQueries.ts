import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY =
  defineQuery(`*[_type == "Project" && defined(slug.current)][0...12]{
  ...
}`);

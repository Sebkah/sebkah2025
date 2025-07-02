import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

import imageUrlBuild from "@sanity/image-url";

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export const imageBuilder = imageUrlBuild(client);

export const urlFor = (source: any) => {
  return imageBuilder.image(source);
};

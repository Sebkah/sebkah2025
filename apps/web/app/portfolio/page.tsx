import Image from "next/image";
import { client, urlFor } from "../../sanity/client";
import { PROJECTS_QUERY } from "../../sanity/queries/projectQueries";

export default async function Home() {
  const projects = await client.fetch(PROJECTS_QUERY);

  const images = projects
    .flatMap(
      (project) =>
        project.content?.map((content) => ({
          builder: urlFor(content),
          ...content,
        })) || []
    )
    .filter((img) => img && img.builder);

  return (
    <div className="relative w-2/3 h-2/4 p-6 pointer-events-none">
      <div
        className="w-full grid gap-6 grid-flow-col-dense grid-rows-3 h-full"
        style={{ gridAutoColumns: "20vw" }}
      >
        {images.map(({ builder, ...content }, index) => {
          const { size } = content;

          // Determine grid span based on size
          const getGridSpan = (size: string | undefined) => {
            switch (size) {
              case "large":
                return "col-span-3 row-span-3";
              case "medium":
                return "col-span-2 row-span-2";
              case "small":
              default:
                return "col-span-1 row-span-1";
            }
          };

          // Determine aspect ratio based on size

          return (
            <div
              key={index}
              className={`relative w-full h-full  overflow-hidden ${getGridSpan(size)} `}
            >
              <Image
                src={builder.width(800).height(600).url() || ""}
                alt={`Project image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

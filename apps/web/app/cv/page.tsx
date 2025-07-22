import { client } from "../../sanity/client";
import { CV_QUERY } from "../../sanity/queries/projectQueries";
import Portrait from "../components/Portrait";

const numberOfColumns = 10;
const numberOfRows = 11;

const cellNumber = 2 * numberOfColumns * 2 * numberOfRows;

const gap = 20;
const gridSpacingBase = `1fr ${gap}px `;

const gridTemplateColumns = `repeat(${numberOfColumns}, ${gridSpacingBase})`;
const gridTemplateRows = `repeat(${numberOfRows}, ${gridSpacingBase})`;

const formationX = 1; // 2 columns from the left

const CV = async () => {
  const cvData = await client.fetch(CV_QUERY);

  console.log("CV Data:", cvData);
  return (
    <div className="fixed z-100000 inset-0 ">
      {/* BACKGROUND GRID */}
      <div
        className="absolute top-0 left-0 grid h-full w-full"
        style={{ gridTemplateColumns, gridTemplateRows }}
      >
        {Array.from({ length: cellNumber }).map(() => {
          return (
            <div
              className="w-full h-full border border-white/60 border-dashed border-l-[1.5] border-t-1 "
              key={Math.random().toString(36).substring(2, 15)}
            ></div>
          );
        })}
      </div>

      {/* ANimated svg portrait with framer motion  */}

      {/* CV CONTENT */}
      <div
        className="grid h-full w-full"
        style={{ gridTemplateColumns, gridTemplateRows }}
      >
        <div
          className=""
          style={{
            gridColumn: `${formationX} / span 4`,
            gridRow: "1 / span 11",
          }}
        >
          {/*     <Portrait /> */}
        </div>
        <SectionTitle
          title="Jobs"
          coordinates={{
            x: formationX,
            y: 2,
            w: 2,
            h: 10,
          }}
        />
      </div>
    </div>
  );
};

type CvLineProps = Coordinates & {
  border?: boolean;
};

type Coordinates = {
  coordinates: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
};

type SectionTitleProps = Coordinates & {
  title: string;
};

const SectionTitle = ({ title, coordinates }: SectionTitleProps) => {
  const { x, y, w, h } = coordinates;
  return (
    <>
      <div
        className="overflow-hidden"
        style={{
          gridColumn: `${x} / span ${w}`,
          gridRow: `${y} / span ${h}`,
          writingMode: "vertical-rl",
          fontSize: 65,
          lineHeight: "1.5em",
        }}
      >
        <div>{title}</div>
      </div>
      <CVLine
        coordinates={{
          x: x + 1,
          y: y,
          w: 1,
          h: h + 2,
        }}
        border
      />
    </>
  );
};

const CVLine = ({ coordinates, border }: CvLineProps) => {
  const { x, y, w, h } = coordinates;
  return (
    <div
      className={"border-white border-l-[6px] border-r-[6px]"}
      style={{
        gridColumn: `${x} / span ${w}`,
        gridRow: `${y} / span ${h}`,
      }}
    ></div>
  );
};

export default CV;

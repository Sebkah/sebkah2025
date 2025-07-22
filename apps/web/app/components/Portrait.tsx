"use client";
import { motion } from "framer-motion";

export default function Portrait() {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const commonStyle = {
    fill: "none",
    stroke: "white",
    strokeDasharray: "none",
    strokeOpacity: 1,
  };

  return (
    <div className="w-full h-full">
      <motion.svg
        width={"100%"}
        height={"100%"}
        viewBox="0 0 120.68095 114.89766"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
            strokeLinecap: "round",
          }}
          d="m 60.039871,207.04737 c 0,0 6.82857,-6.05552 8.503502,-9.53423 1.674931,-3.4787 0.128841,-5.15363 0.901888,-6.57089 0.773043,-1.41724 2.834499,-0.12884 4.122909,-2.19029 1.28841,-2.06146 -3.736387,-3.09218 -3.092183,-7.08625 0.644205,-3.99407 5.153637,-4.50944 7.601614,-8.63234 2.447978,-4.12291 -2.319136,-2.31914 -0.128841,-4.89596 2.190297,-2.57682 11.982206,-7.08625 13.399458,-7.60161"
          id="path1"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
            strokeLinecap: "round",
          }}
          d="m 84.133125,190.42689 c 0,0 2.190295,-6.82857 2.8345,-10.04959 0.644205,-3.22103 -2.319136,-4.38059 -0.644205,-8.11698 1.674934,-3.73639 7.859297,-14.30134 9.791912,-15.07439 1.932614,-0.77304 16.233958,-8.76118 16.233958,-8.76118 l 3.60755,-2.06146"
          id="path2"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
          }}
          d="m 117.24524,161.5021 c 0,0 -0.19326,-14.94554 -2.06145,-22.9981"
          id="path3"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
          }}
          d="m 133.22152,127.03715 c 0,0 -0.90189,12.17547 4.50943,22.0318"
          id="path4"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 132.19079,126.07085 c 8.37466,7.92371 10.30727,-21.64528 0,-8.37466"
          id="path5"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.665",
            strokeLinecap: "round",
          }}
          d="m 126.58621,135.21855 c 0,0 -6.82857,6.11995 -13.07735,2.25472 -6.24879,-3.86523 -8.5035,-9.14771 -8.95445,-11.66011 -0.45094,-2.51239 0.38652,-5.66899 0.0644,-7.08625 -0.3221,-1.41724 -1.35283,-1.73935 -1.61051,-3.1566 -0.25768,-1.41725 1.80377,-9.79191 1.80377,-9.79191"
          id="path6"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
          }}
          d="m 112.54255,110.4811 c 0,0 -1.15957,1.03072 -1.15957,1.61051 0,0.57978 0.3221,1.09514 0.25768,1.48167 -0.0644,0.38652 -1.93261,2.38356 -1.93261,3.41428 0,1.03073 1.03073,2.5124 1.03073,2.5124"
          id="path7"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
          }}
          d="m 111.70508,117.88945 1.22399,1.35283"
          id="path8"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
          }}
          d="m 114.41074,117.56735 1.09515,1.41725"
          id="path9"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.765",
          }}
          d="m 109.64363,115.57031 c -4.18733,-0.77304 -5.21806,1.73936 -5.21806,1.73936 0,0 2.96334,1.6105 5.21806,-1.73936 z"
          id="path10"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.665",
          }}
          d="m 122.39888,112.73581 c -2.70566,-0.90188 -4.50943,-0.83746 -5.669,1.22399 0,0 2.25471,1.41725 5.669,-1.22399 z"
          id="path11"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.665",
            strokeLinecap: "round",
          }}
          d="m 116.98756,110.93204 c 0,0 1.15957,-1.09515 2.5124,-0.77305"
          id="path12"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.665",
            strokeLinecap: "round",
          }}
          d="m 106.80913,113.89538 c 0,0 -1.73936,-0.12884 -2.57682,1.09515"
          id="path13"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
            strokeLinecap: "round",
          }}
          d="m 110.09457,110.54552 c 0,0 -3.28544,-0.25769 -6.76415,1.99703"
          id="path14"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
            strokeLinecap: "round",
          }}
          d="m 115.89242,109.19268 c 2.44797,-0.77304 3.41428,-2.12587 7.98813,-1.15956"
          id="path15"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.365",
            strokeLinecap: "round",
          }}
          d="m 120.14417,113.18676 1.03073,-0.38653"
          id="path16"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.3",
            strokeLinecap: "round",
          }}
          d="m 108.35523,115.76357 -1.09515,1.03073"
          id="path17"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.665",
          }}
          d="m 109.25711,126.71505 c 0,0 2.64124,-3.99407 3.22102,-4.44501 0.57978,-0.45094 2.31914,0.12884 2.96334,-0.0644 0.64421,-0.19326 0.38652,-0.77304 0.96631,-0.83747 0.57978,-0.0644 4.44501,0.57979 4.44501,0.57979"
          id="path18"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.565",
          }}
          d="m 110.60994,127.23042 c 0,0 1.54609,-1.99704 2.12587,-2.31914 0.57979,-0.3221 1.22399,-0.25768 1.22399,-0.25768 0,0 0.12884,-0.3221 0.6442,-0.51537 0.51537,-0.19326 6.05553,0 7.08626,0.25769"
          id="path19"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
          }}
          d="m 115.63473,126.07085 c -0.90188,-0.25769 -0.90188,-0.25769 -0.90188,-0.25769"
          id="path20"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
          }}
          d="m 113.38002,130.25818 c 0,0 3.02776,-3.15661 5.92668,-0.96631"
          id="path21"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
          }}
          d="m 112.96932,147.95337 c 0,0 -4.19079,4.00859 -4.55521,12.7546 -0.36442,8.74602 -1.82209,45.18773 -1.82209,45.18773"
          id="path22"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
            strokeLinecap: "round",
          }}
          d="m 116.7957,205.71349 c 0,0 -1.82208,-6.92392 0.54663,-13.30122 2.36871,-6.3773 5.46626,-12.39019 2.91534,-20.04295 -2.55092,-7.65276 -3.46197,-10.93251 -3.46197,-10.93251"
          id="path23"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
            strokeLinecap: "round",
          }}
          d="m 134.46994,207.53558 c 0,-3.09755 1.45767,-9.11043 0.18221,-13.30123 -1.27547,-4.19079 -5.46626,-12.02576 -5.10185,-15.30552 0.36442,-3.27975 7.10614,-20.22515 7.10614,-20.22515 0,0 2.91534,-7.10614 2.00429,-9.47485"
          id="path24"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
            strokeLinecap: "round",
          }}
          d="m 135.01656,143.21595 c 0,0 7.47055,0.36442 8.19939,5.10184 0.72883,4.73742 -5.28405,15.48773 -6.01288,20.40736"
          id="path25"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
            strokeLinecap: "round",
          }}
          d="m 149.77546,159.97914 -7.28835,-13.30123"
          id="path26"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
            strokeLinecap: "round",
          }}
          d="m 142.30491,206.62454 -0.91105,-7.47055 c 0,0 2.91534,-19.49632 3.82638,-22.77608 0.91105,-3.27975 2.0043,-13.11902 3.82638,-13.84785"
          id="path27"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
          }}
          d="m 144.3092,149.95767 c 0,0 4.37301,0.54662 10.38589,8.19938"
          id="path28"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "1.065",
          }}
          d="m 179.65767,174.73804 c -0.18221,-2.18651 -1.82209,-6.74172 -6.01289,-9.65706 -4.19079,-2.91534 -19.31411,-7.10613 -19.31411,-7.10613"
          id="path29"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 117.56735,159.37623 c 0,0 2.57682,4.38059 7.73045,3.92964 5.15364,-0.45094 10.82264,-3.67196 10.82264,-3.67196"
          id="path30"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 117.1164,162.14631 c 0,0 3.73639,4.38059 8.1814,4.31617 4.44501,-0.0644 9.27655,-2.64124 9.27655,-2.64124"
          id="path31"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 126.45737,103.20158 c -0.0543,3.9824 0.69963,6.34566 3.1566,9.21213 0.39458,0.46034 1.75655,1.54609 2.31914,1.54609"
          id="path32"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 104.61883,105.7784 c -1.12684,-0.42441 -1.738,-0.83476 -2.25471,-1.86819"
          id="path33"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 120.27301,101.97759 c -2.25981,0.92447 -3.94059,1.70959 -6.37763,2.25472 -0.95519,0.21366 -9.95017,-0.74819 -11.59568,-1.15957"
          id="path34"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 104.42557,102.6218 c 4.41687,0.62631 9.30107,1.10512 13.72156,0 1.17617,-0.29404 2.20427,-1.05929 3.34986,-1.28841"
          id="path35"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 106.48703,101.59107 c 1.74638,-0.36812 14.1846,0.69653 15.58975,-0.70862"
          id="path36"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 103.5881,100.56034 c 4.26338,-2.14457 13.99225,-1.636218 18.81078,0.77305"
          id="path37"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 109.19269,100.36708 c 2.73186,0.63886 10.93659,-1.174448 12.75525,0.64421"
          id="path38"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 107.19565,98.82099 c -0.65324,-0.217747 -0.71817,-0.175366 -1.28841,-1.030727 -0.54276,-0.814138 3.62036,-0.795951 4.44501,-0.773046 5.84732,0.162428 8.796,1.41237 13.5283,4.251753"
          id="path39"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 112.22045,95.92207 c 0.79452,0.107367 1.59878,0.158014 2.38355,0.322103 5.42531,1.134383 13.90705,5.411317 10.50054,5.411317"
          id="path40"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 110.4811,94.955764 c 5.29703,-1.4228 9.59199,-0.695976 13.14177,3.221024 0.95341,1.052039 2.18375,1.644734 3.02776,2.770082"
          id="path41"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 115.69915,95.406706 c 4.6661,0.05201 8.74633,1.979211 11.66011,5.475744"
          id="path42"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 120.27301,93.602933 c 4.26379,0.635082 7.30962,3.466089 7.98813,7.537197"
          id="path43"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 122.1412,95.149026 c 0.68715,0.300627 1.43132,0.495088 2.06145,0.901885 2.41229,1.557298 3.10357,2.084218 4.25176,4.380589 0.10799,0.216 0.79297,1.75929 0.25768,1.22399"
          id="path44"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 124.46034,94.955764 c 6.50347,2.154809 7.3995,4.031924 9.08328,9.083286"
          id="path45"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 126.58621,97.017217 c 1.35592,0.558268 6.37488,3.162093 5.15364,5.604583"
          id="path46"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 127.29484,99.078673 c 2.23928,2.379237 1.64657,1.277557 2.38355,2.898917"
          id="path47"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 126.84389,102.81506 c 1.20579,2.39137 1.92187,8.07045 4.96038,9.08329"
          id="path48"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 129.22745,103.266 c -0.14726,3.4105 0.88245,6.61587 3.28544,9.01887"
          id="path49"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 130.90238,102.87948 c -0.3633,3.8169 -0.1562,7.92195 2.5124,10.88706"
          id="path50"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 131.93311,104.36115 c 0.70744,2.94134 3.98047,7.17787 2.44798,10.24285"
          id="path51"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 132.77058,104.68325 c 2.04537,2.96901 4.83517,6.78648 3.09218,10.11402"
          id="path52"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 132.31963,103.97463 c 0.91056,0.85537 3.17496,2.84924 3.86523,3.99407 0.2047,0.3395 2.47993,5.13757 0.83746,5.41132"
          id="path53"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 130.06492,113.18675 c 0.73207,2.39973 1.42382,3.17545 3.54312,4.05849"
          id="path54"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 131.99753,107.32449 c 1.07112,2.69256 2.95664,7.7472 1.93261,10.30728"
          id="path55"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 127.74578,98.241206 c 1.87017,1.476587 3.77971,2.997264 4.31617,5.411324"
          id="path56"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 129.03419,108.67732 c 2.93155,1.69499 3.4293,3.92093 3.80081,6.89299"
          id="path57"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 130.90238,111.83393 c -1.0494,1.40396 1.25623,2.93129 1.41725,3.73638"
          id="path58"
          variants={pathVariants}
        />
        <motion.path
          style={{
            ...commonStyle,
            strokeWidth: "0.865",
            strokeLinecap: "round",
          }}
          d="m 133.22152,104.74768 c 1.05479,2.36595 1.39744,5.95655 1.67493,8.24581"
          id="path59"
          variants={pathVariants}
        />
      </motion.svg>
    </div>
  );
}

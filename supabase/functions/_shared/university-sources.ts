export interface UniversitySource {
  title: string;
  allowedDomains: readonly string[];
  catalogUrls: Partial<Record<"ug" | "pg", string>>;
}

export const UNIVERSITY_SOURCES: Readonly<Record<string, UniversitySource>> = {
  hku: {
    title: "The University of Hong Kong",
    allowedDomains: ["hku.hk"],
    catalogUrls: {
      ug: "https://admissions.hku.hk/programmes/undergraduate-programmes",
    },
  },
  cuhk: {
    title: "The Chinese University of Hong Kong",
    allowedDomains: ["cuhk.edu.hk"],
    catalogUrls: {
      ug: "https://admission.cuhk.edu.hk/programmes/list/",
      pg: "https://www.gs.cuhk.edu.hk/programmes",
    },
  },
  hkust: {
    title: "The Hong Kong University of Science and Technology",
    allowedDomains: ["hkust.edu.hk"],
    catalogUrls: {
      ug: "https://join.hkust.edu.hk/our-programs",
      pg: "https://prog-crs.hkust.edu.hk/pgprog",
    },
  },
  cityu: {
    title: "City University of Hong Kong",
    allowedDomains: ["cityu.edu.hk"],
    catalogUrls: {},
  },
  polyu: {
    title: "The Hong Kong Polytechnic University",
    allowedDomains: ["polyu.edu.hk"],
    catalogUrls: {
      ug: "https://www.polyu.edu.hk/study/ug/",
      pg: "https://www.polyu.edu.hk/study/pg/",
    },
  },
  oxford: {
    title: "University of Oxford",
    allowedDomains: ["ox.ac.uk"],
    catalogUrls: {},
  },
  cambridge: {
    title: "University of Cambridge",
    allowedDomains: ["cam.ac.uk"],
    catalogUrls: {
      ug: "https://www.undergraduate.study.cam.ac.uk/courses",
      pg: "https://www.postgraduate.study.cam.ac.uk/courses",
    },
  },
  imperial: {
    title: "Imperial College London",
    allowedDomains: ["imperial.ac.uk"],
    catalogUrls: {
      ug: "https://www.imperial.ac.uk/study/courses/",
      pg: "https://www.imperial.ac.uk/study/courses/",
    },
  },
  ucl: {
    title: "University College London",
    allowedDomains: ["ucl.ac.uk"],
    catalogUrls: {},
  },
  lse: {
    title: "London School of Economics and Political Science",
    allowedDomains: ["lse.ac.uk"],
    catalogUrls: {
      ug: "https://www.lse.ac.uk/study-at-lse/Undergraduate",
      pg: "https://www.lse.ac.uk/study-at-lse/Graduate",
    },
  },
  manchester: {
    title: "The University of Manchester",
    allowedDomains: ["manchester.ac.uk"],
    catalogUrls: {
      ug: "https://www.manchester.ac.uk/study/undergraduate/courses/",
      pg: "https://www.manchester.ac.uk/study/masters/courses/",
    },
  },
  bristol: {
    title: "University of Bristol",
    allowedDomains: ["bristol.ac.uk"],
    catalogUrls: {},
  },
  mit: {
    title: "Massachusetts Institute of Technology",
    allowedDomains: ["mit.edu"],
    catalogUrls: {
      ug: "https://catalog.mit.edu/",
      pg: "https://catalog.mit.edu/degree-charts/",
    },
  },
  columbia: {
    title: "Columbia University",
    allowedDomains: ["columbia.edu"],
    catalogUrls: {},
  },
  uiuc: {
    title: "University of Illinois Urbana-Champaign",
    allowedDomains: ["illinois.edu"],
    catalogUrls: {
      ug: "https://www.admissions.illinois.edu/academics/majors",
      pg: "https://grad.illinois.edu/admissions/programs",
    },
  },
  nyu: {
    title: "New York University",
    allowedDomains: ["nyu.edu"],
    catalogUrls: {
      ug: "https://bulletins.nyu.edu/undergraduate/",
      pg: "https://bulletins.nyu.edu/graduate/",
    },
  },
  toronto: {
    title: "University of Toronto",
    allowedDomains: ["utoronto.ca"],
    catalogUrls: {
      ug: "https://future.utoronto.ca/undergraduate-programs",
      pg: "https://www.sgs.utoronto.ca/programs/",
    },
  },
  ubc: {
    title: "The University of British Columbia",
    allowedDomains: ["ubc.ca"],
    catalogUrls: {
      ug: "https://you.ubc.ca/programs/",
      pg: "https://www.grad.ubc.ca/prospective-students/graduate-degree-programs",
    },
  },
  mcgill: {
    title: "McGill University",
    allowedDomains: ["mcgill.ca"],
    catalogUrls: {
      ug: "https://www.mcgill.ca/undergraduate-admissions/programs",
    },
  },
  waterloo: {
    title: "University of Waterloo",
    allowedDomains: ["uwaterloo.ca"],
    catalogUrls: {
      ug: "https://uwaterloo.ca/future-students/programs",
      pg: "https://uwaterloo.ca/academic-calendar/graduate-studies/catalog#/home/programs",
    },
  },
};

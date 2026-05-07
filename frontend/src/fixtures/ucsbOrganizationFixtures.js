const ucsbOrganizationFixtures = {
  oneOrganization: {
    orgCode: "ZPR",
    orgTranslationShort: "Zeta Phi Rho",
    orgTranslation: "Zeta Phi Rho",
    inactive: false,
  },
  threeOrganizations: [
    {
      orgCode: "ZPR",
      orgTranslationShort: "Zeta Phi Rho",
      orgTranslation: "Zeta Phi Rho",
      inactive: false,
    },
    {
      orgCode: "SKY",
      orgTranslationShort: "Skydiving Club",
      orgTranslation: "Skydiving Club at UCSB",
      inactive: false,
    },
    {
      orgCode: "OSLI",
      orgTranslationShort: "OSLI",
      orgTranslation: "Office of Student Life Involvement",
      inactive: true,
    },
  ],
};

export { ucsbOrganizationFixtures };

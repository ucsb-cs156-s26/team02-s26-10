const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "user1@example.com",
    teamId: "10",
    tableOrBreakoutRoom: "table",
    requestTime: "2022-05-06T23:05:27",
    explanation: "no explanation",
    solved: true,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "user1@example.com",
      teamId: "10",
      tableOrBreakoutRoom: "table",
      requestTime: "2022-05-06T23:05:27",
      explanation: "no explanation",
      solved: true,
    },
    {
      id: 2,
      requesterEmail: "user2@example.com",
      teamId: "10",
      tableOrBreakoutRoom: "room",
      requestTime: "2022-05-06T23:05:27",
      explanation: "no explanation",
      solved: true,
    },
    {
      id: 3,
      requesterEmail: "user3@example.com",
      teamId: "10",
      tableOrBreakoutRoom: "room",
      requestTime: "2022-05-06T23:05:27",
      explanation: "no explanation",
      solved: true,
    },
  ],
};

export { helpRequestFixtures };

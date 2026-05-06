const helpRequestFixtures = {
	oneRequest:{
			id: 1,
			requesterEmail: "string",
			teamId: "string",
			tableOrBreakoutRoom: "string",
			requestTime: "2026-05-06T23:05:27",
			explanation: "string",
			solved: true
		},
	threeRequests: [
		{
			id: 1,
			requesterEmail: "user1@example.com",
			teamId: "10",
			tableOrBreakoutRoom: "string",
			requestTime: "2026-05-06T23:05:27",
			explanation: "string",
			solved: true
		},
		{
			id: 2,
			requesterEmail: "user2@example.com",
			teamId: "10",
			tableOrBreakoutRoom: "string",
			requestTime: "2026-05-06T23:05:27",
			explanation: "string",
			solved: true
		},
		{
			id: 3,
			requesterEmail: "user3@example.com",
			teamId: "string",
			tableOrBreakoutRoom: "string",
			requestTime: "2026-05-06T23:05:27",
			explanation: "string",
			solved: true
		},
	]
};

export { helpRequestFixtures };
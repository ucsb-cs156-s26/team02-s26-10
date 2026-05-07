import { recommendationRequestFixtures } from "main/fixtures/recommendationRequestFixtures";

describe("recommendationRequestFixtures", () => {
  test("exports fixtures in expected shape", () => {
    expect(recommendationRequestFixtures.oneRecommendationRequest).toBeDefined();
    expect(recommendationRequestFixtures.threeRecommendationRequests).toHaveLength(3);
    expect(
      recommendationRequestFixtures.threeRecommendationRequests[0]
        .requesterEmail,
    ).toBe("cgaucho@ucsb.edu");
  });
});


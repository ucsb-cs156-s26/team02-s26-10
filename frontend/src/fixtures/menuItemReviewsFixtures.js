const menuItemReviewsFixtures = {
  oneReview: {
    id: 1,
    itemId: 1,
    reviewerEmail: "test1@testing.com",
    stars: 1,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "1 star",
  },
  threeReviews: [
    {
      id: 1,
      itemId: 1,
      reviewerEmail: "test1@testing.com",
      stars: 1,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "1 star",
    },
    {
      id: 2,
      itemId: 2,
      reviewerEmail: "test2@testing.com",
      stars: 2,
      dateReviewed: "2022-02-02T12:00:00",
      comments: "2 star",
    },
    {
      id: 3,
      itemId: 3,
      reviewerEmail: "test3@testing.com",
      stars: 3,
      dateReviewed: "2022-03-02T12:00:00",
      comments: "3 star",
    },
  ],
};

export { menuItemReviewsFixtures };

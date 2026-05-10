package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {

  @Autowired MenuItemReviewRepository menuItemReviewRepository;

  @Test
  public void admin_user_can_delete_menuitemreview() throws Exception {
    setupUser(true);

    LocalDateTime dateRev = LocalDateTime.parse("2022-01-03T00:00:00");

    MenuItemReview menuItemReview =
        MenuItemReview.builder()
            .itemId(1)
            .reviewerEmail("testing@testemail.com")
            .stars(5)
            .dateReviewed(dateRev)
            .comments("testing comment")
            .build();

    menuItemReviewRepository.save(menuItemReview);

    page.getByText("Menu Item Reviews").click();

    assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-itemId")).hasText("1");

    page.getByTestId("MenuItemReviewsTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-itemId")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_menuitemreview() throws Exception {
    setupUser(false);

    page.getByText("Menu Item Reviews").click();

    assertThat(page.getByText("Create MenuItemReview")).not().isVisible();
    assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-itemId")).not().isVisible();
  }
}

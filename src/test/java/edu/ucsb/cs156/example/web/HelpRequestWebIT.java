package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import com.microsoft.playwright.Locator;
import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {

  @Test
  public void admin_user_can_create_edit_delete_help_request() throws Exception {
    setupUser(true);

    page.getByText("HelpRequest").click();

    page.getByText("Create Help Request").click();
    assertThat(page.getByText("Create New Help Request")).isVisible();

    page.getByTestId("HelpRequestForm-requesterEmail").fill("user@example.com");
    page.getByTestId("HelpRequestForm-teamId").fill("10");
    page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("table");
    page.getByTestId("HelpRequestForm-explanation").fill("N/A");

    Locator dateEntry = page.getByTestId("HelpRequestForm-requestTime");
    dateEntry.click();
    dateEntry.pressSequentially("01182020");
    page.keyboard().press("ArrowRight");
    dateEntry.pressSequentially("120000a");

    page.getByTestId("HelpRequestForm-solved").fill("true");
    page.getByTestId("HelpRequestForm-submit").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("user@example.com");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Help Request")).isVisible();
    page.getByTestId("HelpRequestForm-explanation").fill("Updated explanation");
    page.getByTestId("HelpRequestForm-submit").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
        .hasText("Updated explanation");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-title")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_article() throws Exception {
    setupUser(false);

    page.getByText("HelpRequest").click();

    assertThat(page.getByText("Create Help Request")).not().isVisible();
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-title")).not().isVisible();
  }
}

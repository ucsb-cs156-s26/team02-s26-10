package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestIT {
  @Autowired public CurrentUserService currentUserService;

  @Autowired public GrantedAuthoritiesService grantedAuthoritiesService;

  @Autowired HelpRequestRepository helpRequestRepository;

  @Autowired public MockMvc mockMvc;

  @Autowired public ObjectMapper mapper;

  @MockitoBean UserRepository userRepository;

  @WithMockUser(roles = {"USER"})
  @Test
  public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
    // arrange
    LocalDateTime time = LocalDate.of(2020, Month.JANUARY, 18).atStartOfDay();
    HelpRequest helpRequest =
        HelpRequest.builder()
            .requesterEmail("user@example.com")
            .teamId("10")
            .tableOrBreakoutRoom("table")
            .requestTime(time)
            .explanation("N/A")
            .solved(true)
            .build();

    helpRequestRepository.save(helpRequest);

    // act
    MvcResult response =
        mockMvc.perform(get("/api/helprequest?id=1")).andExpect(status().isOk()).andReturn();

    // assert
    String expectedJson = mapper.writeValueAsString(helpRequest);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void an_admin_user_can_post_a_new_help_request() throws Exception {
    // arrange

    LocalDateTime time = LocalDate.of(2020, Month.JANUARY, 18).atStartOfDay();
    HelpRequest helpRequest =
        HelpRequest.builder()
            .requesterEmail("user@example.com")
            .teamId("10")
            .tableOrBreakoutRoom("table")
            .requestTime(time)
            .explanation("N/A")
            .solved(true)
            .build();

    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/helprequest/post")
                    .param("requesterEmail", "user@example.com")
                    .param("teamId", "10")
                    .param("tableOrBreakoutRoom", "table")
                    .param("requestTime", "2020-01-18T00:00:00")
                    .param("explanation", "N/A")
                    .param("solved", "true")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    helpRequest.setId(1);
    String expectedJson = mapper.writeValueAsString(helpRequest);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }
}

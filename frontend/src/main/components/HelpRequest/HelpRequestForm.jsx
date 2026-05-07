import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function HelpRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks

  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  // Stryker restore Regex

  // Stryker disable next-line all
  const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Accepts from 1900-2099 followed by 1-4.  Close enough.

  // Stryker disable next-line all
  const  tof_regex = /true|false/

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="HelpRequestForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-requesterEmail"
              id="requesterEmail"
              type="text"
              isInvalid={Boolean(errors.requesterEmail)}
              {...register("requesterEmail", {
                required: true,
                pattern: email_regex, 
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.requesterEmail && "Requester Email is required. "}
              {errors.requesterEmail?.type === "pattern" &&
                "Requester Email must be a valid email address, eg. example@example.com"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="teamId">Team ID</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-teamId"
              id="teamId"
              type="text"
              isInvalid={Boolean(errors.teamId)}
              {...register("teamId", {
                required: true,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.teamId && "teamId is required. "}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="tableOrBreakoutRoom">Table Or Breakout Room</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-tableOrBreakoutRoom"
              id="tableOrBreakoutRoom"
              type="text"
              isInvalid={Boolean(errors.tableOrBreakoutRoom)}
              {...register("tableOrBreakoutRoom", {
                required: true,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.tableOrBreakoutRoom && "Table or Breakout Room is required. "}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="requestTime">Request Time</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-requestTime"
              id="requestTime"
              type="datetime-local"
              isInvalid={Boolean(errors.requestTime)}
              {...register("requestTime", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.requestTime && "Request Time is required. "}
              {errors.requestTime?.type === "pattern" &&
                "Request Time must be in the iso format YYYY-MM-DDThh:mm:ssZ, e.g. 2022-07-23T12:00:00Z"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="explanation">Explanation</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-explanation"
              id="explanation"
              type="text"
              isInvalid={Boolean(errors.explanation)}
              {...register("explanation", {
                required: true,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.explanation && "Explanation is required. "}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="solved">Solved</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-solved"
              id="solved"
              type="text"
              isInvalid={Boolean(errors.solved)}
              {...register("solved", {
                required: true,
                pattern: tof_regex
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.solved && "Whether the request is solved ('true' or 'false') is required. "}
              {errors.solved?.type === "pattern" &&
                "Whether the request is solved must be a boolean value ('true' or 'false')."}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="HelpRequestForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="HelpRequestForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default HelpRequestForm;

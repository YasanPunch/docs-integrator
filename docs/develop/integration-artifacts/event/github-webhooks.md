---
title: GitHub Webhooks
---

# GitHub Webhooks

GitHub event integration is currently in **Beta**.

GitHub event integrations receive webhook callbacks from GitHub and trigger handler functions as repository events occur. Use them to automate CI/CD workflows, sync issue trackers, enforce code review policies, and react to repository activity in real time.

## Creating a GitHub Events service

1. Click **+ Add Artifact** in the canvas or click **+** next to **Entry Points** in the sidebar.
2. In the **Artifacts** panel, select **GitHub** under **Event Integration**.
3. In the creation form, fill in the following fields:

   ![GitHub Event Integration creation form](/img/develop/integration-artifacts/event/github-webhooks/step-creation-form.png)

   | Field | Description | Default |
   |---|---|---|
   | **Event Channel** | The type of GitHub event to listen for. Select a service type from the dropdown (for example, **IssuesService**, **PullRequestService**). See [Event channels](#event-channels) for all options. | Required |
   | **Webhook Secret** | Secret used to validate incoming GitHub webhook requests. Configure the same value in your GitHub repository webhook settings. | — |
   | **Webhook Listener Port** | The port on which the webhook listener accepts incoming HTTP requests. | `8090` |

   Expand **Advanced Configurations** to set the listener name.

   | Field | Description | Default |
   |---|---|---|
   | **Listener Name** | Identifier for the listener created with this service. | `githubListener` |

4. Click **Create**.

5. WSO2 Integrator opens the service in the **Service Designer**. The canvas shows the attached listener pill, the active event channel pill, and the **Event Handlers** section with all handlers for the selected channel pre-added.

   ![Service Designer showing the GitHub Event Integration canvas](/img/develop/integration-artifacts/event/github-webhooks/step-service-designer.png)

   All event handlers for the selected channel are added automatically. Click any handler to open it in the flow diagram view and implement the logic.

```ballerina
import ballerinax/github;
import ballerina/log;

configurable string webhookSecret = ?;
configurable int port = 8090;

listener github:Listener githubListener = new (port, {webhookSecret: webhookSecret});

service github:IssuesService on githubListener {

    remote function onOpened(github:IssueEvent event) returns error? {
        log:printInfo("Issue opened",
                      number = event.issue.number,
                      title = event.issue.title,
                      repo = event.repository.name);
    }

    remote function onClosed(github:IssueEvent event) returns error? {
        log:printInfo("Issue closed", number = event.issue.number);
    }

    remote function onReopened(github:IssueEvent event) returns error? {
        log:printInfo("Issue reopened", number = event.issue.number);
    }

    remote function onAssigned(github:IssueEvent event) returns error? {
        log:printInfo("Issue assigned", number = event.issue.number);
    }

    remote function onUnassigned(github:IssueEvent event) returns error? {
        log:printInfo("Issue unassigned", number = event.issue.number);
    }

    remote function onLabeled(github:IssueEvent event) returns error? {
        log:printInfo("Issue labeled", number = event.issue.number);
    }

    remote function onUnlabeled(github:IssueEvent event) returns error? {
        log:printInfo("Issue unlabeled", number = event.issue.number);
    }
}
```

## Service and listener configuration

In the **Service Designer**, click the **Configure** icon in the header to open the **GitHub Event Integration Configuration** panel.

![GitHub Event Integration Configuration panel](/img/develop/integration-artifacts/event/github-webhooks/step-configuration.png)

The configuration panel has two sections. The top section configures the service and the bottom section configures the attached listener.

**Service configuration:**

| Field | Description |
|---|---|
| **Event Channel** | The GitHub event channel this service handles. Select from the available service types. |

**Listener configuration** (under **Configuration for githubListener**):

| Field | Description | Default |
|---|---|---|
| **Name** | Identifier for the listener. | `githubListener` |
| **Listener Config** | Webhook validation configuration. Accepts a `ListenerConfig` record expression with a `webhookSecret` field. | `{ webhookSecret: "" }` |
| **Listen On** | Port on which the listener accepts incoming webhook requests. | `8090` |

Click **+ Attach Listener** to attach an additional listener to the same service.

Click **Save Changes** to apply updates.

```ballerina
listener github:Listener githubListener = new (
    8090,
    {webhookSecret: webhookSecret}
);
```

`github:ListenerConfig` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `webhookSecret` | `string` | `""` | Secret used to verify the HMAC signature on incoming GitHub webhook requests |

## Event channels

Each event channel maps to a specific GitHub webhook event type. Select the channel that matches the repository activity your integration needs to respond to.

| Channel | GitHub event | Description |
|---|---|---|
| [`IssuesService`](#issuesservice-handlers) | `issues` | Issues opened, closed, reopened, assigned, labeled, and more |
| [`IssueCommentService`](#issuecommentservice-handlers) | `issue_comment` | Comments created, edited, or deleted on issues and pull requests |
| [`PullRequestService`](#pullrequestservice-handlers) | `pull_request` | Pull requests opened, closed, merged, reviewed, and updated |
| [`PullRequestReviewService`](#pullrequestreviewservice-handlers) | `pull_request_review` | Pull request reviews submitted, dismissed, or edited |
| [`PullRequestReviewCommentService`](#pullrequestreviewcommentservice-handlers) | `pull_request_review_comment` | Comments on pull request review diffs created, edited, or deleted |
| [`ReleaseService`](#releaseservice-handlers) | `release` | Releases published, unpublished, created, edited, or deleted |
| [`LabelService`](#labelservice-handlers) | `label` | Labels created, edited, or deleted |
| [`MilestoneService`](#milestoneservice-handlers) | `milestone` | Milestones created, closed, opened, edited, or deleted |
| [`PushService`](#pushservice-handlers) | `push` | Commits pushed to a branch or tag |
| [`ProjectCardService`](#projectcardservice-handlers) | `project_card` | Project board cards created, edited, moved, or deleted |

## Event handlers

When a GitHub Events service is created, WSO2 Integrator adds all handlers for the selected channel automatically. Click any handler in the **Service Designer** to open the flow diagram view and implement the processing logic.

### IssuesService handlers

| Handler | Triggered when |
|---|---|
| `onOpened` | A new issue is opened |
| `onClosed` | An issue is closed |
| `onReopened` | A closed issue is reopened |
| `onAssigned` | A user is assigned to an issue |
| `onUnassigned` | A user is unassigned from an issue |
| `onLabeled` | A label is added to an issue |
| `onUnlabeled` | A label is removed from an issue |

### PullRequestService handlers

| Handler | Triggered when |
|---|---|
| `onOpened` | A pull request is opened |
| `onClosed` | A pull request is closed or merged |
| `onReopened` | A closed pull request is reopened |
| `onAssigned` | A reviewer is assigned |
| `onUnassigned` | A reviewer is unassigned |
| `onLabeled` | A label is added |
| `onUnlabeled` | A label is removed |
| `onSynchronize` | New commits are pushed to the pull request branch |
| `onReviewRequested` | A review is requested |
| `onReviewRequestRemoved` | A review request is removed |
| `onReadyForReview` | A draft pull request is marked ready for review |
| `onConvertedToDraft` | A pull request is converted to a draft |

### IssueCommentService handlers

| Handler | Triggered when |
|---|---|
| `onCreated` | A comment is added to an issue or pull request |
| `onEdited` | An existing comment is edited |
| `onDeleted` | A comment is deleted |

### PullRequestReviewService handlers

| Handler | Triggered when |
|---|---|
| `onSubmitted` | A pull request review is submitted |
| `onDismissed` | A pull request review is dismissed |
| `onEdited` | A pull request review body is edited |

### PullRequestReviewCommentService handlers

| Handler | Triggered when |
|---|---|
| `onCreated` | A comment is added to a pull request diff |
| `onEdited` | A diff comment is edited |
| `onDeleted` | A diff comment is deleted |

### ReleaseService handlers

| Handler | Triggered when |
|---|---|
| `onPublished` | A release is published |
| `onUnpublished` | A release is unpublished |
| `onCreated` | A release draft is created |
| `onEdited` | A release is edited |
| `onDeleted` | A release is deleted |
| `onPrereleased` | A release is marked as a pre-release |
| `onReleased` | A pre-release is promoted to a full release |

### LabelService handlers

| Handler | Triggered when |
|---|---|
| `onCreated` | A label is created in the repository |
| `onEdited` | A label name or color is changed |
| `onDeleted` | A label is deleted |

### MilestoneService handlers

| Handler | Triggered when |
|---|---|
| `onCreated` | A milestone is created |
| `onOpened` | A closed milestone is reopened |
| `onClosed` | A milestone is closed |
| `onEdited` | A milestone title or description is edited |
| `onDeleted` | A milestone is deleted |

### PushService handlers

| Handler | Triggered when |
|---|---|
| `onPush` | Commits are pushed to a branch or a tag is created or deleted |

### ProjectCardService handlers

| Handler | Triggered when |
|---|---|
| `onCreated` | A card is added to a project board |
| `onEdited` | A card note is edited |
| `onMoved` | A card is moved to a different column |
| `onConverted` | A card note is converted to an issue |
| `onDeleted` | A card is deleted from a project board |

## What's next

- [Kafka](kafka.md) — consume messages from Apache Kafka topics
- [Salesforce Events](salesforce-events.md) — listen to Salesforce Change Data Capture events
- [Connections](../supporting/connections.md) — reuse GitHub credentials across services
- [GitHub connector reference](../../../connectors/catalog/developer-tools/github/overview.md) — full connector API reference

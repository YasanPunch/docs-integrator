# Github Connector Overview

GitHub is a widely used platform for version control and collaboration, allowing developers to work together on projects from anywhere. The Ballerina `ballerinax/github` connector (v5.1.0) provides programmatic access to GitHub through its REST API (version 2022-11-28), enabling you to automate tasks, manage repositories, issues, pull requests, and more directly from Ballerina integration flows.

## Key features

- Full repository management — create, update, delete, list, and fork repositories
- Issue tracking — create, update, list, and comment on issues with label and assignee management
- Pull request management — create, update, list, merge, and review pull requests
- Branch and release management — list branches, create releases, manage tags
- Organization and team management — list orgs, teams, and members
- Gist management — create, update, list, star, fork, and comment on gists
- Security advisory access — query global and repository-specific security advisories
- Resource-based API design using Ballerina resource functions for intuitive path-based access to GitHub REST endpoints

## Actions

Actions are operations you invoke on GitHub from your integration — managing repositories, creating issues, handling pull requests, and more. The GitHub connector exposes 241 resource functions through a single client:

| Client | Actions |
|--------|---------|
| `Client` | Repository CRUD, issues, pull requests, branches, releases, organizations, teams, users, gists, security advisories, notifications |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through creating a GitHub Personal Access Token (PAT) required to authenticate with the GitHub connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [Github Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-github)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.

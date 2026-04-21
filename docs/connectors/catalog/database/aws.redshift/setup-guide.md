---
title: Setup Guide
---

# Setup Guide

This guide walks you through setting up an Amazon Redshift cluster and obtaining the JDBC connection details required to use the AWS Redshift connector.

## Prerequisites

- An active AWS account. If you do not have one, [sign up for an AWS account](https://aws.amazon.com/).

## Step 1: Create a Redshift cluster

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2. Navigate to **Amazon Redshift** from the Services menu (or search for "Redshift").
3. Click **Create cluster**.
4. Enter a **Cluster identifier** (e.g., `my-redshift-cluster`).
5. Choose a **Node type** and number of nodes based on your workload requirements.
6. Under **Database configurations**, set:
    - **Database name**: Enter a name (e.g., `mydb`).
    - **Admin user name**: Enter a username (e.g., `admin`).
    - **Admin user password**: Enter a strong password.
7. Click **Create cluster** and wait for the cluster status to become **Available**.

Cluster creation may take several minutes. The cluster status must be **Available** before you can connect.

## Step 2: Configure network access

1. In the Redshift console, select your cluster and go to the **Properties** tab.
2. Under **Network and security**, find the **VPC security group** associated with the cluster.
3. Click the security group link to open it in the EC2 console.
4. Add an **Inbound rule** to allow TCP traffic on port **5439** (default Redshift port) from your application's IP address or CIDR range.
5. Save the security group rules.

Do not open port 5439 to `0.0.0.0/0` in production. Restrict access to specific IP addresses or use VPC peering.

## Step 3: Enable public accessibility (if needed)

If your Ballerina application runs outside the cluster's VPC:

1. Select your cluster in the Redshift console.
2. Click Actions → **Modify publicly accessible setting**.
3. Enable **Turn on Publicly accessible**.
4. Click **Save changes**.

For production workloads, consider using VPC peering or AWS PrivateLink instead of public accessibility.

## Step 4: Obtain the JDBC URL

1. In the Redshift console, select your cluster.
2. Under the **General information** section, copy the **JDBC URL**. It follows this format:

    ```
    jdbc:redshift://<cluster-endpoint>:5439/<database-name>
    ```

    For example:

    ```
    jdbc:redshift://my-redshift-cluster.abc123xyz.us-east-1.redshift.amazonaws.com:5439/mydb
    ```

3. Note down the **admin username** and **password** you set during cluster creation.

Store the JDBC URL, username, and password securely. Use Ballerina's `configurable` feature and a `Config.toml` file to supply them at runtime.

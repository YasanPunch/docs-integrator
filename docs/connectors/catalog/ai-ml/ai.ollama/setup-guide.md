---
title: Setup Guide
---

# Setup Guide

This guide walks you through installing and running an Ollama server locally so the Ballerina connector can communicate with it.

## Prerequisites

- A machine with sufficient resources to run LLMs (at least 8 GB RAM recommended for smaller models).

## Step 1: Install Ollama

1. Visit the [Ollama download page](https://ollama.com/download) and download the installer for your operating system (macOS, Linux, or Windows).
2. Follow the platform-specific installation instructions:
    - **macOS**: Open the downloaded `.dmg` file and drag Ollama to your Applications folder.
    - **Linux**: Run the install script:
      ```
      curl -fsSL https://ollama.com/install.sh | sh
      ```
    - **Windows**: Run the downloaded installer and follow the prompts.

On Linux, the install script sets up Ollama as a systemd service that starts automatically.

## Step 2: Start the Ollama server

1. Open a terminal and run:
    ```
    ollama serve
    ```
2. The server starts on `http://localhost:11434` by default.
3. Verify it is running by opening `http://localhost:11434` in a browser — you should see "Ollama is running".

On macOS, launching the Ollama application from the Applications folder automatically starts the server. You do not need to run `ollama serve` separately.

## Step 3: Pull a model

1. Pull the model you want to use. For example, to download Llama 2:
    ```
    ollama pull llama2
    ```
2. You can list available models with:
    ```
    ollama list
    ```
3. Browse all available models at the [Ollama model library](https://ollama.com/library).

Start with smaller models like `llama2` or `mistral` for faster downloads and lower resource usage. Larger models like `llama2:70b` require significantly more RAM and disk space.

## Step 4: Verify the setup

1. Test the model by running a quick prompt:
    ```
    ollama run llama2 "Hello, how are you?"
    ```
2. If the model responds, your Ollama server is ready to use with the Ballerina connector.

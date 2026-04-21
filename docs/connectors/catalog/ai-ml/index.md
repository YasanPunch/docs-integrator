---
title: AI & Machine Learning
---

# AI & Machine Learning

## Available connectors

| Connector | Description | Operations | Authentication |
|-----------|-------------|------------|----------------|
| [AI Devant](ai.devant/overview.md) | AI-powered document chunking and binary file loading for RAG and AI pipelines | Chunk, Load | Bearer Token |
| [AI Memory MSSQL](ai.memory.mssql/overview.md) | MSSQL-backed short-term memory store for AI agent chat message persistence and retrieval | Put, Get, GetAll, Remove, IsFull, GetCapacity | Username/Password |
| [Anthropic LLM](ai.anthropic/overview.md) | LLM model provider for Anthropic Claude chat completions and structured generation | Chat, Generate, Tool Calling | API Key |
| [Azure AI Search](azure.ai.search/overview.md) | Azure AI Search service management for indexes, indexers, data sources, skillsets, and synonym maps | Create, Read, Update, Delete, List, Run, Reset, Analyze, Statistics | API Key |
| [Azure AI Search Index](azure.ai.search.index/overview.md) | AI-powered cloud search with full-text, semantic, and vector search over indexed documents | Search, Lookup, Index, Suggest, Autocomplete, Count | API Key |
| [Azure OpenAI](ai.azure/overview.md) | Azure-hosted OpenAI chat completions, embeddings, and AI Search knowledge base | Chat, Generate, Embed, Ingest, Retrieve, Delete | API Key |
| [DeepSeek](ai.deepseek/overview.md) | LLM chat completion and structured generation with DeepSeek models | Chat, Generate, Tool Calling | API Key |
| [Milvus](milvus/overview.md) | Open-source vector database for similarity search, vector upsert, and collection management | Create Collection, Load, Index, Upsert, Delete, Search, Query | API Token / Credentials |
| [Mistral](mistral/overview.md) | AI platform with chat completions, code generation, embeddings, OCR, moderation, fine-tuning, and batch processing | Chat, FIM, Embed, OCR, Moderate, Fine-tune, Batch | API Key |
| [Mistral AI](ai.mistral/overview.md) | LLM provider with chat completions, structured generation, and tool calling | Chat, Generate, Tool Calling | API Key |
| [NP](np/overview.md) | Model provider bridge for Ballerina's Natural Programming feature, supporting OpenAI and Azure OpenAI | Natural Language Processing, Structured Response Parsing | API Key |
| [Ollama](ai.ollama/overview.md) | Local LLM inference with chat completions, tool calling, and structured output generation | Chat, Generate | None (local server) |
| [OpenAI](openai/overview.md) | AI platform with chat completions, image generation, audio processing, embeddings, assistants, and fine-tuning | Chat, Images, Audio, Embeddings, Assistants, Files, Fine-Tuning, Batches, Moderations | API Key (Bearer Token) |
| [OpenAI (AI)](ai.openai/overview.md) | LLM model provider and embedding provider for OpenAI chat completions, structured generation, and text embeddings | Chat, Generate, Tool Calling, Embed | API Key |
| [OpenAI Audio](openai.audio/overview.md) | Text-to-speech, transcription, and audio translation using OpenAI TTS and Whisper models | Speech Generation, Transcription, Translation | API Key (Bearer Token) |
| [OpenAI Fine-Tunes](openai.finetunes/overview.md) | Fine-tune OpenAI models with custom training data, manage files and models | Upload, Fine-Tune, List, Retrieve, Delete, Monitor | API Key (Bearer Token) |
| [pgvector](ai.pgvector/overview.md) | Vector similarity search in PostgreSQL with dense, sparse, and hybrid embeddings | Add, Query, Delete | Username/Password |
| [Pinecone](ai.pinecone/overview.md) | Vector database with dense, sparse, and hybrid similarity search | Add, Query, Delete | API Key |
| [Weaviate](ai.weaviate/overview.md) | Vector database with semantic search, metadata filtering, and embedding storage | Add, Query, Delete | API Key |

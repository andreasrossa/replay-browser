![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/andreasrossa/replay-browser?utm_source=oss&utm_medium=github&utm_campaign=andreasrossa%2Freplay-browser&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

# Slippi Replay Browser

Automatically record SSBM replays from multiple consoles.

## What is this for?

This is the browser component for this Project.
It enables you to filter, view and analyze replays.

## How do I record a replay for this?

There is a _collector_ component written in Elixir as well, it will be linked here as soon as it is available.

# TODO

- [/] Add API routes to post replay start/end events
- [ ] implement api calls in collector for replay start/end events
- [ ] show modal with token when collector is created
- [ ] show modal with token when collector token is regenerated
- [ ] Live Replay Updates
  - [ ] Add socket.io server for websocket connection
  - [ ] Push replay events to redis on collector
  - [ ] Consume replay events on socket.io server and forward via websocket
  - [ ] display replay updates in frontend

This repo is my code-challenge I had to do for a %%company-name%%.

Check it live on gh pages: [https://colossal-squid.github.io/vue-example-stonks-app/](https://colossal-squid.github.io/vue-example-stonks-app/)

The task was to create a vue app that allows you to subscribe to price updates for financial products identified by ISIN.

Make up any random ISINs, or past real ones to test it. The WS backend implementation provided is long gone, there's a mock in node `my-ws-mock.js` and a little "mock" via setTimeout that i'm using in github pages build. 

If you want to run it with my-ws-mock, change `WsMockWrapper` usages to `WsWrapper`, start my-ws-mock, change service url in `WsWrapper` and you're all set

#### THINGS I'VE PRIORITIZED AS "IMPORTANT"

- everything "starts", "builds" and passes tests i've written
- functionally - things work
- little chart thingy!

#### THINGS I WOULD HAVE DONE, if i had all the time in the world

- complete 100% unit-test coverage [i wanted to do the chart so bad, i gave it higher prio]
- an e2e test
- "animated" chart, splines instead of straight lines
- better "you're offline" screen with edge-cases like "socket closed/disconnected" handled via adding more context / maybe a little "retry/reconnect" routine
- handling multiple tabs open on one device
- eslint/stylelint, i'm sure some spaces from vscode auto-format might look funny

If we meet in person after this - lets talk them through!

## Answers to Questions

1. What happens in case the WebSocket disconnects? How would you go further to keep
   the live data available or inform the user? Please discuss the challenges.

In case ws disconnects, we don't have actual data onscreen. I went for the cheapest solution, and just rendered a popup saying: you're offline, something is off, to not show "non-actualized" data. 

"Expensive" solution would be leaving the previous values as is + showing some toast notification about us re-connecting, showing number of retries and time we've been down. If it's a few seconds - i guess it's less frustrating then refreshing the page + we didn't lie about anything, everyone knew data is not up to date.

The "challenge" with this solution I foresee is adding a few more layers of interceptors and state. If there's some underlying infra stuff on BE - I can't think of one (I imagine a user has a session ID, so his list of subscriptions is persisted on BE and we can continue from where we've been, once reconnected)

2. What happens if a user adds an instrument multiple times to their list? Please discuss possible challenges and mitigations.

If we're talking about instrument with same ISIN - he can't, right? By our requirements and design both BE and FE shouldn't allow this, so we don't go crazy sending same update 50 times.

Some cute animation "shaking" input-field and highlighting the already present item in the list for a sec would be cool, i should have done it, i think

3. What potential performance issues might you face when this app scales with multiple subscriptions? How would you improve the speed and user experience?

At the moment on frontend the screen is re-painted per-message, where 1 message is 1 update for 1 particular instrument. Once we go over a certain threshold i expect things to start stuttering, and then it would make sense to "batch" repaints with a ~50ms? debounce. The debounce time is tricky here, since it's a real-time system. 

Once list goes too big: we could add paging, hide all page size overflow and re-paint only visible stuff
(but then we also need search and filters on UI, i suspect)

Instead of "small canvas per element", once paging is in place, i could paint "one big vertical row" and paint that once for all the elements (But i'd run a bit of testing before, to see if it improves paint time significantly)

These are optimisations that first came to my mind.

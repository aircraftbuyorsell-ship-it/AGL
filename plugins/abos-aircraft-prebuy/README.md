# ABOS Aircraft Pre-Buy Advisor

A Claude plugin that walks buyers and sellers of used general-aviation aircraft through a disciplined pre-purchase process. It is built by Aircraft Buy Or Sell (ABOS), one of the largest aircraft trading communities on Facebook, from the checklists experienced pilots, owners and restorers use when they look at a used aircraft.

The plugin contains one skill, `aircraft-prebuy`. Claude uses it automatically when you talk about buying or evaluating an aircraft, or you can ask for it by name.

## What it helps with

- **Listing triage**: a quick green / amber / red read on an advertised aircraft, plus the information still missing from the listing.
- **Logbook and records review**: airframe, engine and propeller logs; continuity of times; major repairs and alterations; life-limited parts; Airworthiness Directive (AD) and Service Bulletin (SB) status; installed STCs.
- **Registry and title checks**: FAA (N-registered) and EASA/European registers, including the Czech ÚCL register (OK-), liens and transfer paperwork.
- **Pre-buy inspection planning**: a scope matched to piston singles and twins, turboprops and light jets, done by an inspector who is independent of the seller.
- **Red flags and fraud signals**: damage history, missing logs, prop strikes, corrosion, payment and escrow scams.
- **Seller questions** grouped by topic, ready to send.
- **A structured pre-buy report** with a clear recommendation and next steps.

Claude answers in the language you write in.

## Example prompts

- "I'm looking at a 1978 Cessna 182Q, 4,200 TT, 1,650 SMOH, logs complete except 1992–1994. What should I worry about?"
- "Review this listing for a Piper PA-28-181 and tell me what to ask the seller." (paste the listing text)
- "Plan a pre-buy inspection for a PC-12 I'm buying from a US seller and importing into the EU."
- "The seller wants a 20% deposit wired to his personal account before I see the plane. Is that normal?"

## What it does not do

- It does **not** replace an inspection by a licensed mechanic or inspector (FAA A&P/IA, EASA Part-66 or a CAMO). It never declares an aircraft airworthy.
- It does **not** invent AD numbers, service bulletin numbers or market prices. Applicability of ADs must be checked against the official FAA or EASA AD databases for the specific serial numbers.
- It is not legal, tax or financial advice. For title, contracts, import duties and VAT, use a qualified professional.

## Data and privacy

The plugin is instructions and reference text only. It contains no scripts, hooks, MCP servers or network calls, and it sends nothing to ABOS or anyone else. It only works with what you share in your conversation with Claude. See [PRIVACY.md](PRIVACY.md).

## Install

Once listed, add **ABOS Aircraft Pre-Buy Advisor** from the plugin directory in Claude. To try it locally in Claude Code before then:

```bash
git clone https://github.com/aircraftbuyorsell-ship-it/AGL.git
claude --plugin-dir ./AGL/plugins/abos-aircraft-prebuy
```

## Support and security

Report problems, inaccuracies or security concerns through [GitHub Issues](https://github.com/aircraftbuyorsell-ship-it/AGL/issues). Please do not post personal data or aircraft documents publicly in an issue.

## License

Apache License 2.0. See [LICENSE](LICENSE).

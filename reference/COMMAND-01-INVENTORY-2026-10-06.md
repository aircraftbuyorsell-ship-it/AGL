# COMMAND-01 — AGL repository inventory

Datum snapshotu: 2026-10-06T21:10:57Z (23:10:57 Europe/Prague).
Rozsah: pouze COMMAND-01. Evidence scope: STATIC + dřívější REFERENCE_CI.
COMMAND-02 nebyl zahájen. Žádné runtime ani conformance testy nebyly při této inventuře spuštěny.

## Výsledek

Inventory je dokončené pro AGL checkout a dostupné relevantní GitHub podklady.
Repo obsahuje 83 sledovaných souborů, 13 implementovaných evidence/mapping
adaptérů, 14 testovacích skriptů a dvě CI workflow. Skutečná ABOS CORE
conformance tím není prokázaná. Dalším krokem je baseline podle issue #9.

## Identita a revize

- Repository: [aircraftbuyorsell-ship-it/AGL](https://github.com/aircraftbuyorsell-ship-it/AGL).
- Public repository; default branch: main.
- Git remote: https://github.com/aircraftbuyorsell-ship-it/AGL.git.
- Auditovaný HEAD: [9c4c5f3eb54a363faee2fdf6aaed82884bb82e80](https://github.com/aircraftbuyorsell-ship-it/AGL/commit/9c4c5f3eb54a363faee2fdf6aaed82884bb82e80).
- HEAD message: Add NVIDIA OpenShell interoperability mapping.
- HEAD commit time: 2026-10-03T09:11:47Z.
- Working branch pro report: agl/command-01-inventory-2026-10-06.
- Checkout před vytvořením reportu byl čistý a odpovídal GitHub main SHA.
- GitHub recursive tree byl úplný: truncated=false; 83 blob položek.
- GitHub snapshot: 9 otevřených issues, collection všech PR vrátila prázdný seznam.
  PR #98 není potvrzen v AGL; jeho případná existence v ABOS nebyla v tomto
  příkazu ověřována.
- Root AGENTS.md, .codex/config.toml a reference/AGENT-WORKLOG.md v auditovaném
  commitu nejsou. Dodaný master prompt byl přečten z připraveného souboru
  mimo checkout; jeho instalace není součástí této inventury.
- Codex CLI v prostředí není nainstalovaný. Inventuru provedl tento agent
  přímo přes shell/git a GitHub. gpt-5.6 / medium je požadovaná konfigurace,
  nikoliv potvrzení přepnutí aktivního modelu chatu.

## Komponenty

| Oblast | Ověřený artefakt | Skutečný doložený stav | Co zatím nelze tvrdit |
| --- | --- | --- | --- |
| ADL | ADL/README.md, ADL/SPEC.md | Agent Definition Language integration profile, draft 0.1.0 | Konkrétní ověřená runtime ADL integrace |
| APL | APL/SPEC.md; APL/AGL-01-APL-Core-Spec-v1.0-rc1.md; request/manifest schemas | Policy Layer specifikace 0.1.0 a samostatný rc1, grammar, reconciliation a validation matrix | Že všechny texty mají stejnou normativní verzi nebo že tu existuje obecný policy engine |
| AEL | AEL/README.md, AEL/SPEC.md, schemas/ael-evidence-record.schema.json | Evidence spec 0.1.0 a minimální JSON Schema | Runtime enforcement, kompletní lineage či evidence storage |
| Security & Trust | SECURITY-TRUST.md; adapters/spiffe; adapters/slsa-in-toto | Specifikace a převod identity/attestation záznamů | Kryptografická verifikace SVID/attestation, revocation enforcement |
| Execution Graph | reference/AGL-EXECUTION-GRAPH-v1.md; graph schema, example a reconstruction test | Draft v0.1, strojové schéma a test rekonstrukce pevného příkladu | Rekonstrukce skutečného ABOS běhu |
| Observability / measurement | reference/AGL-RUNTIME-OBSERVABILITY-v1.md; reference/AGL-MEASUREMENT-UNIT-v1.md; measurement schema/example | Dokumenty, měření propojené s příkladem a CI validace | Napojení na skutečný runtime nebo měřená ekonomika ABOS |
| Conformance | CONFORMANCE.md; conformance/README.md; conformance/test-vectors.json | Definice CORE/SECURE/INTEGRATED a popisy případů | Spustitelný obecný CORE runner nebo aktuální ABOS PASS |
| ABOS reference | reference/ABOS.md; reference/ABOS-ADAPTER-CONTRACT.md; reference/ABOS-INTEGRATION-AUDIT.md | Architektonické mapování dvou ABOS cest a známé mezery | Aktuální stav externího ABOS kódu/deploymentu |
| Mappings | mappings/MCP.md, mappings/A2A.md; interoperability mapping | Mapování a integrační program I-01–I-13 | Ověřená shoda s oficiálními externími verzemi |
| Tests | 13 adapters/*/test/*.mjs + test/agl-execution-graph-reconstruction.test.mjs | Přímé Node/assert skripty, historické CI výsledky níže | Nové lokální PASS nebo normativní conformance |
| CI | .github/workflows/agl-execution-graph-validation.yml; agl-openshell-validation.yml | Dvě workflow pro push s path filtry, Node 20 | CI na aktuálním HEAD nebo CI ABOS CORE |

## Schémata a hranice validace

Šest souborů v schemas/ deklaruje JSON Schema Draft 2020-12:

| Soubor | Role / poznámka |
| --- | --- |
| apl-agent-manifest.schema.json | Legacy APL-shaped agent manifest; declarative metadata |
| apl-request.schema.json | Request; delegation/approval/trust jsou permissive objects |
| ael-evidence-record.schema.json | Minimální actor/event/status/correlation evidence envelope |
| adl-evidence-record.schema.json | Výslovně LEGACY; nové evidence má používat AEL |
| agl-execution-graph.schema.json | Úplný graf: vyžaduje agl_version, execution_id, service, execution, nodes, edges, evidence |
| agl-measurement.schema.json | Measurement contract, explicit evidence_refs a measurement_state |

conformance/test-vectors.json je další JSON Schema popisující formát pole
test vectors. Neobsahuje pole konkrétních vstupních/výstupních fixture případů.
Není to spustitelná conformance suite.

V auditovaném checkoutu nebyly nalezeny explicitní authorization_root_id,
parent_authorization_id ani human_authorized_root. To dokládá stav AGL
artefaktů, nikoliv jejich nepřítomnost v externím ABOS repozitáři.
Existují delegation deklarace a graph relations, ale nejsou samy důkazem
vynucení child_authority ⊆ parent_authority.

## I-01–I-13: skutečné artefakty

Všechny řádky mají README, src modul a test script v uvedeném adresáři.
IMPLEMENTED zde znamená implementovaný převodník/mapování, nikoliv celý
externí standard, jeho trust služby nebo runtime authorization.
Historické testování je pouze REFERENCE_CI uvedené v následující sekci.
Oficiální source/version audit a externí conformance: NOT_RUN pro všech 13.

| ID | Target | Adresář | Exportovaná funkce | Doložená hranice |
| --- | --- | --- | --- | --- |
| I-01 | OpenTelemetry | adapters/opentelemetry | otlpTraceToAgl | OTLP trace JSON → fragment; metrics/logs nejsou samostatně implementované |
| I-02 | OpenLineage | adapters/openlineage | openLineageEventToAgl | RunEvent → run/job/dataset fragment |
| I-03 | W3C PROV | adapters/prov | provJsonToAgl | PROV-JSON-style entity/activity/agent relations |
| I-04 | MCP | adapters/mcp | mcpToolCallToAgl | Normalizovaný call/result → evidence; nevykonává autorizovaný tool call |
| I-05 | A2A | adapters/a2a | a2aTaskToAgl | Task/agent/client context → evidence; delegated_by edge nevynucuje delegaci |
| I-06 | SPIFFE | adapters/spiffe | spiffeIdentityToAgl | Identity observation; bez SVID kryptografické validace |
| I-07 | SLSA / in-toto | adapters/slsa-in-toto | slsaInTotoToAgl | Attestation metadata/subject digest; bez ověření podpisu |
| I-08 | ODRL | adapters/odrl | odrlToAgl | Policy expression mapping; bez policy evaluation |
| I-09 | NIST AI RMF | adapters/nist-ai-rmf | nistAiRmfToAgl | Framework/control references a deklarovaný stav |
| I-10 | ISO/IEC 42001 | adapters/iso-42001 | iso42001ToAgl | Requirement/control references; bez certification claim |
| I-11 | EU AI Act | adapters/eu-ai-act | euAiActToAgl | Legal/applicability references; neprovádí právní posouzení |
| I-12 | Gaia-X | adapters/gaia-x | gaiaXToAgl | Self-Description/service composition; bez trust/compliance validation |
| I-13 | NVIDIA OpenShell | adapters/openshell | openShellDecisionToAgl | Runtime enforcement observation; odlišné od APL decision |

Ve src modulech nejsou SDK imports. Implementace přijímají předané záznamy,
nevytvářejí samy skutečné externí integrace. Testy používají ručně vytvořená
data a Node assert; neověřují všechny output fragments přes společné grafové
schéma. Testy existence polí/relations nejsou důkazem upstream autenticity.

## CI evidence a přesné příkazy

[AGL Execution Graph Validation — run 37112200260](https://github.com/aircraftbuyorsell-ship-it/AGL/actions/runs/37112200260)
- SHA: 8ca0557ca268d99d497b1aee89218b015557f401.
- Event: push; created: 2026-10-03T09:11:19Z; completed / success.
- [Job 111172129388](https://github.com/aircraftbuyorsell-ship-it/AGL/actions/runs/37112200260/job/111172129388)
  měl success pro graph schema, measurement schema, reconstruction a všech
  13 adapter test steps. Výsledek byl přečten přes GitHub API; logy ani
  artefakty testování nebyly znovu spuštěny či staženy.

[AGL OpenShell Adapter Validation — run 37112191393](https://github.com/aircraftbuyorsell-ship-it/AGL/actions/runs/37112191393)
- SHA: bebd673dc025ed709cb0a4888972c6b2dc51fa7f.
- Event: push; created: 2026-10-03T09:11:11Z; completed / success.
- [Job 111172105385](https://github.com/aircraftbuyorsell-ship-it/AGL/actions/runs/37112191393/job/111172105385)
  má success pro Run NVIDIA OpenShell adapter test.
- Starší OpenShell run 37112184940 na 8c72d5741eabb080e1a771c1afb6824b393c0b5a
  skončil failure; novější success je samostatně identifikovaný výše.

Query Actions runs podle auditovaného HEAD 9c4c5f3eb54a363faee2fdf6aaed82884bb82e80 vrátila
total_count=0. Pro aktuální HEAD netvrdíme CI PASS.
git diff z posledního graph success SHA na HEAD mění pouze ROADMAP.md a
reference/AGL-INTEROPERABILITY-STANDARDS-MAPPING-v1.md.
Z OpenShell success SHA navíc mění hlavní CI workflow.
Test/source/schemas tedy mají historicky dohledatelné výsledky, ale workflow
a dokumentační HEAD nesmějí být zaměněny za otestovaný commit.

Obě workflow poslouchají pouze push s path filtry; neobsahují pull_request
ani workflow_dispatch. Hlavní workflow instaluje ajv@8 + ajv-formats@3
pomocí npm install --no-save. V AGL není package.json ani lockfile; Node
skripty lze spouštět přímo. npm ci není příkaz tohoto AGL checkoutu.

Příkazy nalezené v hlavním workflow (pouze inventarizované, NOT_RUN):

~~~bash
npm install --no-save ajv@8 ajv-formats@3
node test/agl-execution-graph-reconstruction.test.mjs
node adapters/opentelemetry/test/otel-to-agl.test.mjs
node adapters/openlineage/test/openlineage-to-agl.test.mjs
node adapters/prov/test/prov-to-agl.test.mjs
node adapters/mcp/test/mcp-to-agl.test.mjs
node adapters/a2a/test/a2a-to-agl.test.mjs
node adapters/spiffe/test/spiffe-to-agl.test.mjs
node adapters/slsa-in-toto/test/slsa-in-toto-to-agl.test.mjs
node adapters/odrl/test/odrl-to-agl.test.mjs
node adapters/nist-ai-rmf/test/nist-ai-rmf-to-agl.test.mjs
node adapters/iso-42001/test/iso-42001-to-agl.test.mjs
node adapters/eu-ai-act/test/eu-ai-act-to-agl.test.mjs
node adapters/gaia-x/test/gaia-x-to-agl.test.mjs
node adapters/openshell/test/openshell-to-agl.test.mjs
~~~

Dva další workflow steps mají inline Node/Ajv2020 validátory:
graph schema versus graph example; measurement schema versus measurement
example. Reuse těchto přesných validatorů patří do dalších příkazů; nový
runner nebyl v inventuře vytvořen.

## Issues a skutečný gate

[Issue #9 — AGL-09: Execute CORE conformance tests against ABOS adapters](https://github.com/aircraftbuyorsell-ship-it/AGL/issues/9)
je OPEN. Body deklaruje ABOS-side guard test/agl-core-governance.test.mjs
(commit 98ed6f4) a dedicated .github/workflows/agl-core-conformance.yml
(commit a5bb81d), Node 22 a npm ci. To jsou odkazy v issue, ne nyní ověřené
ABOS implementation/CI výsledky. Je nutné je ověřit v ABOS v COMMAND-02.

Issue žádá CI execution result, převod failures na konkrétní fixes/tests a
finální CORE evidence. Jeho comments collection byla prázdná při čtení.
Další issues #1–#8 jsou OPEN a stále obsahují původní číslování/terminologii:
APL, ADL evidence, Security & Trust, MCP, A2A, conformance, SDK/CLI, ABOS.

ROADMAP.md používá nové číslování: AGL-03 = CORE, AGL-09 = SER.
Pro tento validation milestone používat jednoznačný permalink issue #9;
automaticky nepřečíslovávat issues ani roadmapu.

## Doložené nesrovnalosti a mezery

| ID | Pozorování a evidence | Dopad / ověření v dalším kroku |
| --- | --- | --- |
| INV-01 | README, ADL/SPEC a AEL/SPEC používají správné ADL/APL/AEL; conformance/README, mappings/MCP, mappings/A2A, reference/ABOS*, Security & Trust a examples stále používají ADL jako evidence | Přijetí jednotné termínové baseline; v inventuře bez přejmenování |
| INV-02 | Issue #9 CORE versus ROADMAP AGL-09 SER a AGL-03 CORE | Gate vázat na issue permalink, nikoliv pouze label AGL-09 |
| INV-03 | APL/SPEC 0.1.0 versus APL rc1 a validation/reconciliation dokumenty | Při conformance uvést přesnou specifikaci/verzi; neslučovat do implicitní normy |
| INV-04 | AGL obsahuje reference contract, ne ABOS gateway runtime ani test/agl-core-governance.test.mjs | Pro COMMAND-02 je nezbytný aktuální ABOS checkout/commit a skutečné execution evidence |
| INV-05 | Lineage fields authorization_root_id / parent_authorization_id nejsou v AGL checkoutu | V COMMAND-02B ověřit ABOS runtime, nestačí deklarace delegation relation |
| INV-06 | conformance/test-vectors.json je formátové schéma, conformance/README popis případů | Zjistit skutečnou behavior suite a coverage; nelze tvrdit spustitelný CORE runner v AGL |
| INV-07 | OpenShell fragment používá id/type, ostatní node_id/node_type; plný graph schema má jiné required fields | Potvrdit fragment composition/normalization boundary; současný test nevaliduje output proti grafovému schématu |
| INV-08 | OpenShell test očekává completed u allow enforcement observation; MCP normalizer bez error předpokládá completed | Rozlišit enforcement/call observation od skutečného governed action success; ověřit input/composition contract, nejde o nyní reprodukovaný runtime failure |
| INV-09 | Aktuální HEAD má zero Actions runs; historické green refs explicitně jiné | Převzít pouze attributable reference evidence; ABOS gate tím neuzavírat |
| INV-10 | Kořen neobsahuje dodané AGENTS.md/config; README deklaruje Apache 2.0, ale tracked LICENSE není | Setup a license artifact jsou faktické mezery, nevynucují architektonický rebuild |

INV-07/08 jsou statické nálezy k ověření. Nebyla spuštěna reprodukce a
nejsou vydávány za FAIL skutečného runtime. Fragment nemusí být samostatný
úplný graf; potřebná composition cesta nebyla v tracked code nalezena.

Oficiální externí specifikace, paper watchlist, Supabase, Cloudflare a Base44
nebyly dotazovány. Stav jejich conformance či live dostupnosti není z
COMMAND-01 odvozen.

## Změny a next action

Změny: pouze tento inventory report a reference/AGENT-WORKLOG.md na pracovní
větvi. Bez změn architektury, schémat, adaptérů, runtime, dependencies či
existing CI. Historický CHECKPOINT-2026-10-03.md zůstal zachován.

NEXT_ACTION: COMMAND-02 pouze — ověřit aktuální ABOS commit, skutečný
test/agl-core-governance.test.mjs a dedicated CORE workflow zmíněné v issue #9;
zjistit coverage a attributable CI result, potom provést bounded CORE
baseline s oddělením REFERENCE a ABOS_RUNTIME. Spouštět pouze autorizované
test/staging operace. Model doporučený pro tento krok: gpt-5.6 / high.

## Úplný tracked-file inventory auditovaného commitu

83 souborů; SHA v tabulce je blob SHA získané z úplného GitHub tree.
Tento appendix popisuje baseline před přidáním dvou reportovacích souborů.

| Path | Bytes | Blob SHA |
| --- | ---: | --- |
| .github/workflows/agl-execution-graph-validation.yml | 5146 | 6a717ac81b8273518ba7bae4d5a0ff20258b1fc4 |
| .github/workflows/agl-openshell-validation.yml | 436 | 86c0bc05f972fbcd575e5f5e6a0346ed1bdde77b |
| ADL/README.md | 1390 | 0d18fcc5dd03b6599c581b1e4aed5de3c8b8c1c7 |
| ADL/SPEC.md | 2041 | 877d6c693a3cbfac18319d7e83f2cf66f3113cca |
| AEL/README.md | 894 | d65cdb0724cf9bd321c9815b948f65ae1871a892 |
| AEL/SPEC.md | 6843 | becb384b89e03c2187102146d52c3526a5a4fb32 |
| APL/AGL-01-APL-Core-Spec-v1.0-rc1.md | 6971 | 599fa655da76a954764b7e9e68319f737a8a1752 |
| APL/AGL-01-APL-Core-Spec.md | 4711 | fa59f1b9f221875e2840c59f5eb57136acd94d7d |
| APL/AGL-01-APL-Grammar-v1.0-rc1.md | 1920 | d4d2b444128aa00dc853a936486bbae7441811ff |
| APL/AGL-01-APL-MCP-Model.md | 4918 | c3627217e800d2158486db53ac2f1007a0c0f01c |
| APL/AGL-01-RECONCILIATION.md | 5098 | 9afa3999aaabd8c93d9db1ee60c09b999594cc74 |
| APL/AGL-01-VALIDATION-MATRIX.md | 3326 | 18ba79e8fb0e6fda93d3afcc1a7cbf82508affa7 |
| APL/README.md | 521 | 1a492049e833895a7a39ccfc8c51658f9d789358 |
| APL/SPEC.md | 6540 | 775773988c3f8bdf1c2be0d70972449d902b5692 |
| ARCHITECTURE.md | 4801 | 7d243777feb52e7314e06627bda9d55636202fff |
| CHECKPOINT-2026-10-03.md | 3978 | ded627fb74c7926e8b80924a36754de09cf83da4 |
| CONFORMANCE.md | 6677 | 5d688cc8d1b6ecf8dafa5d2f04cafb99cba85200 |
| README.md | 3797 | 9e72b6e6feb0ed2e378c46f82c2185a1898873f2 |
| ROADMAP.md | 8651 | 5f9b79d2a92597245e1101b9ede4116afabebe52 |
| SECURITY-TRUST.md | 6289 | ac0bfdb55f7aa3d7c18c2486b1ae32d3d03087d3 |
| adapters/a2a/README.md | 1004 | b38133841a0ae44478ce9da26f8139815516107a |
| adapters/a2a/src/a2a-to-agl.mjs | 3904 | 03c1c2b8f9a062d40f275a4d0434dcd5dd9b3813 |
| adapters/a2a/test/a2a-to-agl.test.mjs | 1094 | 20a2ad87ea52147a5d1a6e91e28959aeaacd1f33 |
| adapters/eu-ai-act/README.md | 737 | 717f6e0faaa395658415652fe86312bbc2a1cfe4 |
| adapters/eu-ai-act/src/eu-ai-act-to-agl.mjs | 2173 | 6f0959d7b102d80f5e56565749fcb84ea036fc22 |
| adapters/eu-ai-act/test/eu-ai-act-to-agl.test.mjs | 636 | 041f94773edee2d60a49be4caa01d91cf293e97e |
| adapters/gaia-x/README.md | 763 | 7e53195a4fba3f0137b71bd27f1e05d22dfccd62 |
| adapters/gaia-x/src/gaia-x-to-agl.mjs | 2991 | 836efb9723bcd3a8dce4b48f9b8ea51dd21bf3c7 |
| adapters/gaia-x/test/gaia-x-to-agl.test.mjs | 838 | 109061f176ac377974e7bb441ebf198cbd3f3d7e |
| adapters/iso-42001/README.md | 605 | 01d9944aae47d21e7fa856686cc740d3bc4f554c |
| adapters/iso-42001/src/iso-42001-to-agl.mjs | 1897 | c3e9a41428067c507672a693883ec0efe8c34bb6 |
| adapters/iso-42001/test/iso-42001-to-agl.test.mjs | 613 | 7ffe641ab2372c7f1ecce5e89692bec75aaad9f2 |
| adapters/mcp/README.md | 950 | d0b9247d2ce2ae4b51b78ae7c67219fab8930de0 |
| adapters/mcp/src/mcp-to-agl.mjs | 4658 | 2af7277ba2c5a9976b8bfb70623fc7d5b3ba908c |
| adapters/mcp/test/mcp-to-agl.test.mjs | 1321 | cfe5aaf20e9970ad2ba78a4eab4c330e0563943f |
| adapters/nist-ai-rmf/README.md | 552 | 2fdc686e944b3869a752c8a4c9682b5b13e28f10 |
| adapters/nist-ai-rmf/src/nist-ai-rmf-to-agl.mjs | 1997 | e07230a55218ad3e813206bc48c288fb96249fb0 |
| adapters/nist-ai-rmf/test/nist-ai-rmf-to-agl.test.mjs | 620 | 1f39fc2b4ccb7832e1ee5a3c29dbf5800cf5cf8f |
| adapters/odrl/README.md | 569 | 95056ac4a36dbf00e675f1a76601d465b1fcbf36 |
| adapters/odrl/src/odrl-to-agl.mjs | 2213 | 333b74cf997bfe00ecbd619b8f54c807bb9c6266 |
| adapters/odrl/test/odrl-to-agl.test.mjs | 845 | 4cd6e2c2dd5f6f40adaaff3a78a0664cef20a744 |
| adapters/openlineage/README.md | 442 | 3234754a04218ae145a7d4e2b286b36dc3347342 |
| adapters/openlineage/src/openlineage-to-agl.mjs | 3825 | 819d6f3395d9a76f194510497aca98a6827adef1 |
| adapters/openlineage/test/openlineage-to-agl.test.mjs | 1151 | 30a0760d57bca4174c3f2562abed398dba5d33f4 |
| adapters/openshell/README.md | 1217 | d38b7fc8874603d01a86e9c379c814804f89270b |
| adapters/openshell/src/openshell-to-agl.mjs | 3131 | e5e5056fdd3f589290b4ee5e9e7dee3fb4bf0211 |
| adapters/openshell/test/openshell-to-agl.test.mjs | 1439 | 1ede9622f92fe1d1093d133a073d72d458198bc4 |
| adapters/opentelemetry/README.md | 777 | 3a9786c21b2eabac2a4275361a0eb6fe85200ca4 |
| adapters/opentelemetry/src/otel-to-agl.mjs | 5169 | 17b9ed2e17de6c2d013793336dd32fa588b6c654 |
| adapters/opentelemetry/test/otel-to-agl.test.mjs | 976 | e08f1ba8ff97a049120681a8432568aa3db67e23 |
| adapters/prov/README.md | 473 | 480b89607161476d464ceb1501305aeefb361ad5 |
| adapters/prov/src/prov-to-agl.mjs | 3161 | 484e03eff88ba53818971104a625e8dbe7daeb3c |
| adapters/prov/test/prov-to-agl.test.mjs | 1317 | aa3244f752063bc2b1e992719b1a419771f87688 |
| adapters/slsa-in-toto/README.md | 619 | 03786a9381d7fe11642c8565d93a68ada73d97e8 |
| adapters/slsa-in-toto/src/slsa-in-toto-to-agl.mjs | 2728 | 7a6bb22fcae225ab620714d85bc9f4fbcf3e424a |
| adapters/slsa-in-toto/test/slsa-in-toto-to-agl.test.mjs | 856 | b763acff45c9862fb059802ad06b528847cad459 |
| adapters/spiffe/README.md | 891 | 0e960be9a259d993fd921d750797f32d3c44a12e |
| adapters/spiffe/src/spiffe-to-agl.mjs | 3938 | fee30dfba8ef26d29723c724d496cbe891ebdb39 |
| adapters/spiffe/test/spiffe-to-agl.test.mjs | 1081 | 6823d533df76c1158563346125b3fd3ec7ef0d7e |
| conformance/README.md | 3582 | 0a2755d19aed14c31d05abf37ba9331196445d6b |
| conformance/test-vectors.json | 621 | 6556216962725670365f955cef710a0eee65e57c |
| examples/agl-execution-graph.example.json | 7312 | dc86ec6226122d4bbe976894d266caede7f03968 |
| examples/agl-measurement.example.json | 1061 | 0ff43c30654489c50021c202f1dc3a87fb38a506 |
| examples/governed-mcp-a2a-flow.md | 729 | e94073dcffdbfac9b63c01b98770569621c6fd45 |
| examples/reference-governed-flow.md | 2494 | a465e134ee67113f908c4d543d8ff9c0f1f30ed8 |
| mappings/A2A.md | 2795 | 9e117b683711f1750a66c72bb328c8360497586c |
| mappings/MCP.md | 2346 | 12c2721cdd904f6314afdba33eb8feb39da2038b |
| reference/ABOS-ADAPTER-CONTRACT.md | 6821 | 94aa97dcae6ddac6b01606c6560b53c8fcdec743 |
| reference/ABOS-INTEGRATION-AUDIT.md | 5668 | 3e5dcfafb3d4ed63e536e0c230a42364c5212f0f |
| reference/ABOS.md | 3341 | 4fb96991e6e52d3ac9aaf6f110a83e5ed32de9cc |
| reference/AGL-EXECUTION-GRAPH-v1.md | 12392 | 6824983ccf5e85660315f4f00eff0a94343ad0db |
| reference/AGL-GAP-ANALYSIS-v1.md | 14167 | 17e4618bff0c0bea3eb1b87e49bb44fb56cbe968 |
| reference/AGL-GAP-MATRIX-v1.md | 10809 | fa3f55b681561c26a3abdaa3ef2ccfe166007186 |
| reference/AGL-INTEROPERABILITY-STANDARDS-MAPPING-v1.md | 11270 | 2c1802449e44e826850bd8c5f0a7afe973aba260 |
| reference/AGL-MEASUREMENT-UNIT-v1.md | 3041 | 4530015120d8b1c7cf289986d40eb323295a79a8 |
| reference/AGL-RUNTIME-OBSERVABILITY-v1.md | 3043 | 3507e0640d1f4832a7f390e015dcaeff7724ce8d |
| schemas/adl-evidence-record.schema.json | 2572 | 27e4ceedaa67e739f28bd9ce86c4e59244836062 |
| schemas/ael-evidence-record.schema.json | 1205 | 11f16797b3914ce85aa321605c49216d3cb9870f |
| schemas/agl-execution-graph.schema.json | 14105 | 23a9c40aaacafe403bb6034c769ddcad3f6a718e |
| schemas/agl-measurement.schema.json | 2334 | bcfc7296b90f5612654d549d4abbf9d46c93c67e |
| schemas/apl-agent-manifest.schema.json | 2047 | 53891ff531e82ab7ca836839e80d4730ee5fa372 |
| schemas/apl-request.schema.json | 1565 | e222827324c96d8eddde71f5b0c5de4eb4fec577 |
| test/agl-execution-graph-reconstruction.test.mjs | 6298 | 98e6579e0d96dd3ff7de5c54765767dcbea349be |

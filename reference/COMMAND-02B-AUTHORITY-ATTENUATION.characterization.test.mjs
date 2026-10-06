import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.env.ABOS_SNAPSHOT_ROOT;
assert.ok(root, 'ABOS_SNAPSHOT_ROOT must point to an exact-revision ABOS snapshot');

const governancePath = path.join(root, 'base44/functions/_shared/workflowGovernance.mjs');
const workflowEnginePath = path.join(root, 'base44/functions/workflowEngine/entry.ts');
const gatewayPath = path.join(root, 'base44/functions/governedSkillGateway/entry.ts');
const aplPath = path.join(root, 'gateway/src/apl.js');

const governanceSource = fs.readFileSync(governancePath, 'utf8');
const workflowEngineSource = fs.readFileSync(workflowEnginePath, 'utf8');
const gatewaySource = fs.readFileSync(gatewayPath, 'utf8');
const aplSource = fs.readFileSync(aplPath, 'utf8');

const entity = (name) => fs.readFileSync(path.join(root, `base44/entities/${name}.jsonc`), 'utf8');
const persistedLineageSource = [
  entity('WorkflowRun'),
  entity('WorkflowStep'),
  entity('AgentTask'),
  entity('AgentAuditLog'),
].join('\n');

const {
  checkDelegation,
  checkSkillPermission,
  isApprovalUsable,
} = await import(`${pathToFileURL(governancePath).href}?command02b=${Date.now()}`);

const ROOT_ID = 'auth-root-human-001';
const PARENT_ID = 'auth-parent-001';

const agent = {
  agent_key: 'worker-a',
  status: 'ACTIVE',
  allowed_skills: ['lookup-aircraft'],
};
const skill = {
  skill_id: 'lookup-aircraft',
  status: 'ACTIVE',
  enabled: true,
};
const workflow = {
  owner_agent_key: 'director',
  orchestrator_key: 'orchestrator',
  allowed_agents: ['worker-a'],
  required_skills: ['lookup-aircraft'],
  optional_skills: [],
};

test('baseline: circular and over-depth delegation fail closed', () => {
  assert.equal(checkDelegation({ path: ['director', 'worker-a'], nextAgentKey: 'director' }).allowed, false);
  assert.equal(checkDelegation({ path: ['a', 'b'], nextAgentKey: 'c', maxDepth: 2 }).allowed, false);
});

test('baseline: undeclared skill expansion fails closed', () => {
  const denied = checkSkillPermission({
    agent,
    skill: { ...skill, skill_id: 'delete-production-data' },
    workflow,
  });
  assert.equal(denied.allowed, false);
});

test('baseline: rejected and expired approvals fail closed', () => {
  assert.equal(isApprovalUsable({ status: 'rejected', decided_by: 'human@example.test' }), false);
  assert.equal(isApprovalUsable({
    status: 'approved',
    decided_by: 'human@example.test',
    expires_at: '2020-01-01T00:00:00Z',
  }, { now: new Date('2026-10-06T00:00:00Z') }), false);
});

test('1. narrowed delegation preserves root and parent authorization lineage', () => {
  const result = checkDelegation({
    path: ['director'],
    nextAgentKey: 'worker-a',
    authorization_root_id: ROOT_ID,
    parent_authorization_id: PARENT_ID,
    parent_authority: { capabilities: ['lookup', 'valuate'], resources: ['aircraft:*'] },
    child_authority: { capabilities: ['lookup'], resources: ['aircraft:N12345'] },
  });
  assert.equal(result.allowed, true);
  assert.equal(result.authorization_root_id, ROOT_ID);
  assert.equal(result.parent_authorization_id, PARENT_ID);
});

test('2. equal-scope delegation is allowed only under an explicit parent delegation policy', () => {
  const result = checkDelegation({
    path: ['director'],
    nextAgentKey: 'worker-a',
    authorization_root_id: ROOT_ID,
    parent_authorization_id: PARENT_ID,
    parent_authority: { capabilities: ['lookup'], resources: ['aircraft:N12345'], may_delegate_equal_scope: false },
    child_authority: { capabilities: ['lookup'], resources: ['aircraft:N12345'] },
  });
  assert.equal(result.allowed, false, 'equal scope must not pass when the parent policy forbids it');
});

test('3. attempted privilege expansion fails closed', () => {
  const result = checkDelegation({
    path: ['director'],
    nextAgentKey: 'worker-a',
    authorization_root_id: ROOT_ID,
    parent_authorization_id: PARENT_ID,
    parent_authority: { capabilities: ['lookup'], resources: ['aircraft:N12345'] },
    child_authority: { capabilities: ['lookup', 'delete'], resources: ['aircraft:*'] },
  });
  assert.equal(result.allowed, false, 'child authority wider than parent must be denied');
});

test('4. nested delegation preserves common root and immediate parent continuity', () => {
  const result = checkDelegation({
    path: ['director', 'orchestrator'],
    nextAgentKey: 'worker-a',
    authorization_root_id: ROOT_ID,
    parent_authorization_id: 'auth-orchestrator-001',
    expected_parent_authorization_id: 'auth-orchestrator-001',
  });
  assert.equal(result.allowed, true);
  assert.equal(result.authorization_root_id, ROOT_ID);
  assert.equal(result.parent_authorization_id, 'auth-orchestrator-001');
});

test('5. generated subgoal is authorized against requested action and payload before queueing', () => {
  const dispatch = workflowEngineSource.slice(workflowEngineSource.indexOf('async function dispatchTask'));
  const createTask = dispatch.indexOf('db.AgentTask.create');
  assert.ok(createTask > 0, 'dispatch must create an AgentTask');
  const beforeCreate = dispatch.slice(0, createTask);
  assert.match(beforeCreate, /authorization_root_id/);
  assert.match(beforeCreate, /parent_authorization_id/);
  assert.match(beforeCreate, /(attenuat|subset|child_authority)/i);
  assert.match(beforeCreate, /requested_action/);
  assert.match(beforeCreate, /payload/);
});

test('6. resource and tool-argument expansion is rejected even for an allowed skill', () => {
  const result = checkSkillPermission({
    agent,
    skill,
    workflow,
    parent_authority: { resources: ['aircraft:N12345'], arguments: { include_private: false } },
    requested_authority: { resources: ['aircraft:*'], arguments: { include_private: true } },
  });
  assert.equal(result.allowed, false, 'allowed skill identity must not bypass resource and argument scope');
});

test('7. approval is bound to this run, skill, action category and exact payload', () => {
  const approval = {
    approval_id: 'appr-001',
    status: 'approved',
    decided_by: 'human@example.test',
    run_id: 'different-run',
    skill_id: 'different-skill',
    action_category: 'different-action',
    payload: { registration: 'N99999' },
  };
  const usable = isApprovalUsable(approval, {
    now: new Date('2026-10-06T00:00:00Z'),
    run_id: 'run-001',
    skill_id: 'lookup-aircraft',
    action_category: 'skill_execute',
    payload: { registration: 'N12345' },
  });
  assert.equal(usable, false, 'an approval for a different action must not authorize execution');
  assert.match(gatewaySource, /(approval\.run_id|run_id.*approval)/);
  assert.match(gatewaySource, /(approval\.skill_id|skill_id.*approval)/);
});

test('8. persisted evidence supports authorization-lineage reconstruction', () => {
  assert.match(persistedLineageSource, /authorization_root_id/);
  assert.match(persistedLineageSource, /parent_authorization_id/);
  assert.match(aplSource, /authorization_root_id/);
  assert.match(aplSource, /parent_authorization_id/);
  assert.match(aplSource, /(validate|check).*delegat/i);
});

test('authorization lineage is evaluated before the governed side effect', () => {
  const execute = gatewaySource.indexOf('raw = await executeSkill');
  assert.ok(execute > 0, 'governed gateway must expose a governed execution boundary');
  const beforeExecute = gatewaySource.slice(0, execute);
  assert.match(beforeExecute, /authorization_root_id/);
  assert.match(beforeExecute, /parent_authorization_id/);
  assert.match(beforeExecute, /(attenuat|subset|child_authority)/i);
});

test('missing or unverifiable authorization fails closed before APL execution', () => {
  const dispatch = aplSource.slice(aplSource.indexOf('export async function callAplTool'));
  const execute = dispatch.indexOf('output = await execute');
  assert.ok(execute > 0, 'APL gateway must expose an execution boundary');
  const beforeExecute = dispatch.slice(0, execute);
  assert.match(beforeExecute, /(validate|check).*authoriz/i);
  assert.match(beforeExecute, /(missing|not_captured|unverifiable).*authoriz/i);
});

test('delegator identity is bound to the workflow run before a child task is created', () => {
  const dispatch = workflowEngineSource.slice(workflowEngineSource.indexOf('async function dispatchTask'));
  const createTask = dispatch.indexOf('db.AgentTask.create');
  const beforeCreate = dispatch.slice(0, createTask);
  assert.match(beforeCreate, /findOne\(db\.AgentDefinition, \{ agent_key: sender \}\)/);
  assert.match(beforeCreate, /(assigned_agent_key|owner_agent_key|orchestrator_key).*sender|sender.*(assigned_agent_key|owner_agent_key|orchestrator_key)/);
});

test('authorization records expose revocation, validity, replay and consumption controls', () => {
  const authorizationSurface = [governanceSource, workflowEngineSource, gatewaySource, persistedLineageSource].join('\n');
  assert.match(authorizationSurface, /revoked_at|revocation_status/);
  assert.match(authorizationSurface, /valid_until/);
  assert.match(authorizationSurface, /consumed_at|single_use|replay_nonce/);
});

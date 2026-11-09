const test = require('node:test');
const assert = require('node:assert');
const { computeState, buildCards } = require('../src/utils/streakState');

const H = 3600 * 1000;
const rewards = Array.from({ length: 7 }, (_, i) => ({
  day: i + 1, rewardType: 'VES', currency: 'VES', amount: (i + 1) * 5,
  title: 'Daily Reward', subtitle: '', assetType: 'coin', metadata: {},
}));
const config = { claimIntervalHours: 24, claimWindowHours: 24 };
const t0 = new Date('2026-09-05T12:00:00Z');
const at = (h) => new Date(t0.getTime() + h * H);
const cycle = (days, status = 'ACTIVE') => ({
  status, claimedDays: days, claimedCount: days.length, lastClaimAt: t0,
});

test('new user: Day 1 claimable, streak 0', () => {
  const s = computeState({ cycle: null, rewards, config, now: t0 });
  assert.equal(s.mode, 'FRESH'); assert.equal(s.currentDay, 1); assert.equal(s.claimable, true);
  assert.equal(s.currentStreak, 0);
});

test('after Day 1: Day 2 locked with server countdown', () => {
  const s = computeState({ cycle: cycle([1]), rewards, config, now: at(1) });
  assert.equal(s.mode, 'WAITING'); assert.equal(s.currentDay, 2); assert.equal(s.claimable, false);
  assert.equal(s.nextClaimAt.toISOString(), at(24).toISOString());
  assert.equal(s.remainingMs, 23 * H);
});

test('exactly at unlock time Day 2 becomes claimable', () => {
  const s = computeState({ cycle: cycle([1]), rewards, config, now: at(24) });
  assert.equal(s.mode, 'READY'); assert.equal(s.claimable, true); assert.equal(s.currentDay, 2);
});

test('still claimable inside the grace window', () => {
  const s = computeState({ cycle: cycle([1]), rewards, config, now: at(47) });
  assert.equal(s.mode, 'READY'); assert.equal(s.needsReset, false);
});

test('missed day: after window the streak resets to Day 1', () => {
  const s = computeState({ cycle: cycle([1, 2]), rewards, config, now: at(49) });
  assert.equal(s.mode, 'MISSED'); assert.equal(s.needsReset, true);
  assert.equal(s.currentDay, 1); assert.equal(s.claimable, true); assert.equal(s.currentStreak, 0);
  assert.equal(s.lastReset.previousStreak, 2); assert.equal(s.lastReset.missedDay, 3);
});

test('already-reset cycle shows Day 1 and lastReset info', () => {
  const c = { ...cycle([1, 2], 'RESET'), resetAt: at(50) };
  const s = computeState({ cycle: c, rewards, config, now: at(60) });
  assert.equal(s.mode, 'FRESH'); assert.equal(s.currentDay, 1); assert.equal(s.lastReset.missedDay, 3);
});

test('completed cycle waits, then starts a new cycle', () => {
  const done = cycle([1, 2, 3, 4, 5, 6, 7], 'COMPLETED');
  const waiting = computeState({ cycle: done, rewards, config, now: at(2) });
  assert.equal(waiting.mode, 'COMPLETE_WAITING'); assert.equal(waiting.claimable, false);
  const next = computeState({ cycle: done, rewards, config, now: at(25) });
  assert.equal(next.mode, 'FRESH_NEXT_CYCLE'); assert.equal(next.currentDay, 1);
});

test('config change (interval 48h) is respected - nothing hardcoded', () => {
  const s = computeState({ cycle: cycle([1]), rewards, config: { claimIntervalHours: 48, claimWindowHours: 24 }, now: at(30) });
  assert.equal(s.mode, 'WAITING'); assert.equal(s.remainingMs, 18 * H);
});

test('card states: claimed / available(today) / locked', () => {
  const s = computeState({ cycle: cycle([1]), rewards, config, now: at(30) });
  const cards = buildCards(rewards, s);
  assert.equal(cards[0].status, 'CLAIMED');
  assert.equal(cards[1].status, 'AVAILABLE'); assert.equal(cards[1].isToday, true);
  assert.equal(cards[2].status, 'LOCKED');
  assert.equal(cards[6].status, 'LOCKED');
});

test('card states while waiting: next day LOCKED with nextClaimAt', () => {
  const s = computeState({ cycle: cycle([1]), rewards, config, now: at(2) });
  const cards = buildCards(rewards, s);
  assert.equal(cards[1].status, 'LOCKED'); assert.equal(cards[1].isNext, true);
  assert.equal(cards[1].nextClaimAt, at(24).toISOString());
});

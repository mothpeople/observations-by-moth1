import { describe, it, expect } from 'vitest';
import {
  matchItemToIssueId,
  parseMetricNumber,
  normalizeInstagramItem,
} from '../src/utils/socialParsers';

describe('parseMetricNumber', () => {
  it('parses formatted metric strings like 1.2K, 345 views, and 1,234', () => {
    expect(parseMetricNumber('1.2K')).toBe(1200);
    expect(parseMetricNumber('345 views')).toBe(345);
    expect(parseMetricNumber('1,234')).toBe(1234);
    expect(parseMetricNumber('2.5M')).toBe(2500000);
  });

  it('clamps negative numbers and handles null/empty safely', () => {
    expect(parseMetricNumber(-1)).toBe(0);
    expect(parseMetricNumber(-42)).toBe(0);
    expect(parseMetricNumber(null)).toBe(0);
    expect(parseMetricNumber(undefined)).toBe(0);
    expect(parseMetricNumber('')).toBe(0);
  });
});

describe('matchItemToIssueId', () => {
  it('matches all 4 issues via captions and semantic keywords', () => {
    expect(matchItemToIssueId({ caption: 'Watering Grass in a Thunderstorm #ObservationsByMoth1' })).toBe('01');
    expect(matchItemToIssueId({ caption: 'The Meat Grinder: Why Billionaires Panic' })).toBe('02');
    expect(matchItemToIssueId({ caption: 'The War No One Was Supposed to Win — Rat Park & Law 30/2000' })).toBe('03');
    expect(matchItemToIssueId({ caption: 'The Century of Self-Inflicted Humiliation: Lin Zexu & Opium' })).toBe('04');
  });

  it('matches explicit issueId and custom id slugs', () => {
    expect(matchItemToIssueId({ issueId: '4' })).toBe('04');
    expect(matchItemToIssueId({ id: 'ig-reel-03' })).toBe('03');
    expect(matchItemToIssueId({ id: 'post-02' })).toBe('02');
    expect(matchItemToIssueId({ id: 'watering-grass-reel' })).toBe('01');
  });

  it('uses #ObservationsByMoth1 + publish date fallback for Issue #04', () => {
    expect(
      matchItemToIssueId({
        caption: 'New essay out now #ObservationsByMoth1',
        publishedAt: '2026-11-16T08:00:00Z',
      })
    ).toBe('04');

    expect(
      matchItemToIssueId({
        caption: 'Generic clip #ObservationsByMoth1',
        publishedAt: '2026-11-10T08:00:00Z',
      })
    ).toBeNull();
  });
});

describe('normalizeInstagramItem', () => {
  it('clamps -1 hidden likes and views to 0', () => {
    const normalized = normalizeInstagramItem({
      shortCode: 'ABC123xyz',
      caption: 'The Century of Self-Inflicted Humiliation',
      likesCount: -1,
      videoPlayCount: -5,
      commentsCount: 12,
    });

    expect(normalized.likes).toBe(0);
    expect(normalized.views).toBe(0);
    expect(normalized.comments).toBe(12);
    expect(normalized.url).toBe('https://www.instagram.com/p/ABC123xyz/');
  });

  it('detects Reel / Video type when productType is clips or views > 0', () => {
    const reel = normalizeInstagramItem({
      id: 'reel-1',
      productType: 'clips',
      videoPlayCount: 840,
      likesCount: 35,
    });

    expect(reel.type).toBe('Reel / Video');
    expect(reel.views).toBe(840);
    expect(reel.likes).toBe(35);
  });
});

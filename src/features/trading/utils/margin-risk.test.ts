import { describe, it, expect } from 'vitest';
import {
  getMarginRiskState,
  shouldBlockNewOrders,
  shouldTriggerStopOut,
} from './margin-risk';

describe('margin-risk', () => {
  it('classifies healthy margin', () => {
    expect(getMarginRiskState(250)).toBe('healthy');
  });

  it('classifies alert band', () => {
    expect(getMarginRiskState(150)).toBe('alert');
  });

  it('classifies margin call', () => {
    expect(getMarginRiskState(90)).toBe('margin_call');
    expect(shouldBlockNewOrders(90)).toBe(true);
  });

  it('classifies stop out', () => {
    expect(getMarginRiskState(40)).toBe('stop_out');
    expect(shouldTriggerStopOut(40)).toBe(true);
  });
});

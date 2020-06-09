import { MemberOfPurchaseGuard } from './member-of-purchase.guard';

describe('MemberOfPurchaseGuard', () => {
  it('should be defined', () => {
    expect(new MemberOfPurchaseGuard()).toBeDefined();
  });
});

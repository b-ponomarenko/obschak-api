import { MemberOfTransferGuard } from './member-of-transfer.guard';

describe('MemberOfTransferGuard', () => {
  it('should be defined', () => {
    expect(new MemberOfTransferGuard()).toBeDefined();
  });
});

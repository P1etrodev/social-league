import { RelativeDatePipe } from './relative-date.pipe';

describe('RelativeDate', () => {
  it('create an instance', () => {
    const pipe = new RelativeDatePipe();
    expect(pipe).toBeTruthy();
  });
});

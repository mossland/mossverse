import * as time from "./time";

describe("Time Utils Test", () => {
  const date = new Date();
  it("Time Exchange", () => {
    expect(time.millisecToSec(8000)).toEqual(8);
    expect(time.secToMillisec(8)).toEqual(8000);
    expect(time.secToMillisec(8)).toEqual(8000);
    expect(time.toUnixTime(date)).toEqual(Math.floor(date.getTime() / 1000));
  });
  it("Time Exchange", () => {
    const clock = new Date(date);
    clock.setHours(clock.getHours() + 24);
    expect(time.getTomorrow(date).getTime()).toEqual(clock.getTime());
    clock.setHours(clock.getHours() - 24);

    clock.setHours(clock.getHours() - 24);
    expect(time.getYesterday(date).getTime()).toEqual(clock.getTime());
    clock.setHours(clock.getHours() + 24);

    clock.setSeconds(clock.getSeconds() - 1);
    expect(time.getLastSeconds(1, date).getTime()).toEqual(clock.getTime());
    clock.setSeconds(clock.getSeconds() + 1);

    clock.setMinutes(clock.getMinutes() - 1);
    expect(time.getLastMinutes(1, date).getTime()).toEqual(clock.getTime());
    clock.setMinutes(clock.getMinutes() + 1);

    clock.setMinutes(clock.getMinutes() + 1);
    expect(time.getMinuteDifference(clock.getTime(), date)).toEqual(-1);
    clock.setMinutes(clock.getMinutes() - 1);

    clock.setHours(clock.getHours() - 1);
    expect(time.getLastHour(1, date).getTime()).toEqual(clock.getTime());
    clock.setHours(clock.getHours() + 1);

    clock.setDate(clock.getDate() - 1);
    expect(time.getLastDays(1, date).getTime()).toEqual(clock.getTime());
    clock.setDate(clock.getDate() + 1);

    clock.setMonth(clock.getMonth() - 1);
    expect(time.getLastMonths(1, date).getTime()).toEqual(clock.getTime());
    clock.setMonth(clock.getMonth() + 1);

    clock.setDate(clock.getDate() - 7);
    expect(time.getLastWeeks(1, date).getTime()).toEqual(clock.getTime());
    clock.setDate(clock.getDate() + 7);

    clock.setMinutes(clock.getMinutes() + 1);
    expect(time.getNextMinutes(1, date).getTime()).toEqual(clock.getTime());
    clock.setMinutes(clock.getMinutes() - 1);

    clock.setFullYear(clock.getFullYear() + 1);
    expect(time.getNextYears(1, date).getTime()).toEqual(clock.getTime());
    clock.setFullYear(clock.getFullYear() - 1);
  });
});

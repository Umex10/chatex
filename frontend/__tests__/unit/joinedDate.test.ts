import { joinedDate } from '../../src/utils/joinedDate';
import { describe, it, expect } from 'vitest';

describe("JoinedDate", () => {

  it("should return 'Joined März 2024'", () => {
    const date = "2024-03-15";

    const result = joinedDate(date);

    expect(result).toBe("Joined März 2024");

  })

  it("should return 'Joined Januar 2015'", () => {
    const date = "2015-01-22";

    const result = joinedDate(date);

    expect(result).toBe("Joined Januar 2015");

  })

  it("should return 'Date unkown'", () => {
    const date = "2024-14-15";

    const result = joinedDate(date);

    expect(result).toBe("Date unkown");

  })

})


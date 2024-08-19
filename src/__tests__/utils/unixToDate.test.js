import { unixToDate, dateToUnix } from "../../utils/unixDateConverter"


describe("unixToDate", () => {
    test("Should return a formatted date string when passed a valid Unix timestamp", () => {
        // Arrange
        const timestamp = 1694822400 // September 16, 2023

        // Act
        const result = unixToDate(timestamp)

        // Assert
        expect(result).toBe("2023-09-16")
    })
})

describe("dateToUnix", () => {
    test("Should return a unix timestamp date when passed a date string", () => {
        // Arrange
        const date = "2023-09-16" // September 16, 2023

        // Act
        const result = dateToUnix(date)

        // Assert
        expect(result).toBe(1694793600)
    })
})


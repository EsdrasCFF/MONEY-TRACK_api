function sum(a: number, b: number) {
  return a + b
}

describe('Test sum function', () => {
  it('Should sum two numbers correctly', () => {
    // arrage
    const a = 2
    const b = 2

    // act
    const result = sum(a, b)
    // assert
    expect(result).toBe(4)
  })
})

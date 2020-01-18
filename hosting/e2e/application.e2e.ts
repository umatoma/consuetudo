describe('E2E', () => {

    beforeAll(async () => {
        await page.goto('http://localhost:9999')
    })

    it('should display title', async () => {
        const text = await page.$eval('body', item => item.textContent)
        expect(text).toMatch('Hello World')
    })
})
